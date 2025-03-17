import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";
import { generateObject, generateText } from "ai";
import { D1QB } from "workers-qb";
import { z } from "zod";
import type { Env } from "./bindings";
import { RESEARCH_PROMPT } from "./prompts";
import type { ResearchType } from "./types";
import { getModel, getModelThinking, getSearch, extractSearchMetadata } from "./utils";
import {
	type ResearchBrowser,
	type SearchResult,
	getBrowser,
	webSearch,
} from "./webSearch";

async function deepResearch({
	step,
	env,
	browser,
	query,
	breadth,
	depth,
	learnings,
	visitedUrls,
}: {
	step: WorkflowStep;
	env: Env;
	browser: ResearchBrowser;
	query: string;
	breadth: number;
	depth: number;
	learnings: string[];
	visitedUrls: string[];
}) {
	const serpQueries = await step.do("get serp queries", () =>
		generateSerpQueries({ env, query, learnings, numQueries: breadth }),
	);

	for (const serpQuery of serpQueries) {
		try {
			const result = await webSearch(
				await browser.getActiveBrowser(),
				serpQuery.query,
				5,
			);

			const newUrls = result.map((item) => item.url).filter(Boolean);
			const newBreadth = Math.ceil(breadth / 2);
			const newDepth = depth - 1;

			const { learnings: newLearnings, followUpQuestions } = await step.do(
				"get new learnings",
				() =>
					processSerpResult({
						env,
						query: serpQuery.query,
						result,
						numFollowUpQuestions: newBreadth,
					}),
			);

			const allLearnings = [...learnings, ...newLearnings];
			const allUrls = [...visitedUrls, ...newUrls];

			if (newDepth > 0) {
				const nextQuery = `
          Previous research goal: ${serpQuery.researchGoal}
          Follow-up research directions: ${followUpQuestions.map((q) => `\n${q}`).join("")}
        `.trim();
				return await deepResearch({
					step,
					env,
					browser,
					query: nextQuery,
					breadth: newBreadth,
					depth: newDepth,
					learnings: allLearnings,
					visitedUrls: allUrls,
				});
			}
			return { learnings: allLearnings, visitedUrls: allUrls };
		} catch (error: any) {
			console.error(`Error for query: ${serpQuery.query}`, error);
			return { learnings: [], visitedUrls: [] };
		}
	}

	// If no queries were processed, return empty arrays
	return { learnings: [], visitedUrls: [] };
}

async function processSerpResult({
	env,
	query,
	result,
	numLearnings = 5,
	numFollowUpQuestions = 5,
}: {
	env: Env;
	query: string;
	result: SearchResult[];
	numLearnings?: number;
	numFollowUpQuestions?: number;
}) {
	const contents = result.map((item) => item.markdown).filter(Boolean);

	const res = await generateObject({
		model: getModel(env),
		abortSignal: AbortSignal.timeout(60000),
		system: RESEARCH_PROMPT(),
		prompt: `Given the SERP contents for query <query>${query}</query>, extract up to ${numLearnings} concise and unique learnings. Include entities such as people, places, companies, etc., and also provide up to ${numFollowUpQuestions} follow-up questions to extend the research.\n\n<contents>${contents
			.map((content) => `<content>\n${content}\n</content>`)
			.join("\n")}</contents>`,
		schema: z.object({
			learnings: z
				.array(z.string())
				.describe(`List of learnings (max ${numLearnings})`),
			followUpQuestions: z
				.array(z.string())
				.describe(`Follow-up questions (max ${numFollowUpQuestions})`),
		}),
	});
	return res.object;
}

async function generateSerpQueries({
	env,
	query,
	numQueries = 5,
	learnings,
}: {
	env: Env;
	query: string;
	numQueries?: number;
	learnings?: string[];
}) {
	const res = await generateObject({
		model: getModel(env),
		system: RESEARCH_PROMPT(),
		prompt: `Generate up to ${numQueries} unique SERP queries for the following prompt: <prompt>${query}</prompt>${learnings
			? `\nIncorporate these previous learnings:\n${learnings.join("\n")}`
			: ""
			}`,
		schema: z.object({
			queries: z
				.array(
					z.object({
						query: z.string().describe("The SERP query"),
						researchGoal: z
							.string()
							.describe("The research goal and directions for this query"),
					}),
				)
				.describe(`List of SERP queries (max ${numQueries})`),
		}),
	});
	return res.object.queries.slice(0, numQueries);
}

async function writeFinalReport({
	env,
	prompt,
	learnings,
	visitedUrls,
}: {
	env: Env;
	prompt: string;
	learnings: string[];
	visitedUrls: string[];
}) {
	// Get current date in a readable format
	const currentDate = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const learningsString = learnings
		.map((l) => `<learning>\n${l}\n</learning>`)
		.join("\n");

	const { text } = await generateText({
		model: getModelThinking(env),
		system: RESEARCH_PROMPT(),
		prompt: `Using the prompt <prompt>${prompt}</prompt>, write a detailed final report (3+ pages) that includes all the following learnings. Today's date is ${currentDate}. Output ONLY the report with no introduction or acknowledgment text.
            
<learnings>
${learningsString}
</learnings>

<sources>
${visitedUrls.map((url, i) => `${i + 1}. ${url}`).join("\n")}
</sources>

When creating the report, consider today's date (${currentDate}) for relevance and timeliness of information.`,
	});

	// More robust check for any existing sources section using a regular expression 	 	
	const sourceSectionRegex = /(?:^|\n)#+\s*(?:sources|references|citations|bibliography|works cited)(?:\s|$)/i;
	const hasSourcesSection = sourceSectionRegex.test(text);

	if (!hasSourcesSection) {
		// If no sources section is found, append our own 		 		
		const urlsSection = `\n\n## Sources\n\n${visitedUrls.map((url, i) => `${i + 1}. ${url}`).join("\n")}`;
		return text + urlsSection;
	}

	return text;
}

export class ResearchWorkflow extends WorkflowEntrypoint<Env, ResearchType> {
	async run(event: WorkflowEvent<ResearchType>, step: WorkflowStep) {
		console.log("Starting enhanced workflow with parallel search");

		const { query, questions, breadth, depth, id } = event.payload;
		const fullQuery = `Initial Query: ${query}\nFollowup Q&A:\n${questions
			.map((q) => `Q: ${q.question}\nA: ${q.answer}`)
			.join("\n")}`;

		const browser = await getBrowser(this.env);

		try {
			// Run both research processes in parallel
			console.log("Starting parallel research processes...");
			const [deepResearchResult, directSearchResult] = await Promise.all([
				step.do("deep web research", () =>
					deepResearch({
						step,
						env: this.env,
						browser,
						query: fullQuery,
						breadth: Number.parseInt(breadth),
						depth: Number.parseInt(depth),
						learnings: [],
						visitedUrls: [],
					})
				),
				step.do("ai search grounding", () =>
					this.performDirectSearch(fullQuery, step)
				)
			]);

			// Combine and deduplicate results from both approaches
			console.log("Combining research results...");

			// Deduplicate learnings (simple approach - remove exact duplicates)
			const uniqueLearnings = Array.from(new Set([
				...deepResearchResult.learnings,
				...directSearchResult.learnings
			]));

			// Deduplicate URLs
			const uniqueUrls = Array.from(new Set([
				...deepResearchResult.visitedUrls,
				...directSearchResult.visitedUrls
			]));

			console.log(`Combined ${uniqueLearnings.length} unique learnings from ${uniqueUrls.length} sources`);

			// Generate the final report with the combined data
			console.log("Generating report from combined research sources");
			const report = await step.do("generate report", () =>
				writeFinalReport({
					env: this.env,
					prompt: fullQuery,
					learnings: uniqueLearnings,
					visitedUrls: uniqueUrls,
				})
			);

			// Update the database with the completed report
			const qb = new D1QB(this.env.DB);
			await qb
				.update({
					tableName: "researches",
					data: { status: 2, result: report },
					where: { conditions: "id = ?", params: [id] },
				})
				.execute();

			console.log("Enhanced workflow finished!");
			return {
				learnings: uniqueLearnings,
				visitedUrls: uniqueUrls
			};
		} catch (error) {
			console.error("Error in enhanced research workflow:", error);

			// Update database with error status
			const qb = new D1QB(this.env.DB);
			await qb
				.update({
					tableName: "researches",
					data: {
						status: 3, // Use status 3 for error
						result: `## Error Generating Report\n\nThere was an error generating your research report. Please try again later or try modifying your research query.\n\nError details: ${error instanceof Error ? error.message : "Unknown error"}`
					},
					where: { conditions: "id = ?", params: [id] },
				})
				.execute();

			throw error;
		}
	}

	// Method to handle direct search with Google Search Grounding
	async performDirectSearch(query: string, step: WorkflowStep): Promise<{ learnings: string[], visitedUrls: string[] }> {
		console.log("Starting direct search with Google Search Grounding");

		const currentDate = new Date().toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		try {
			const model = getSearch(this.env);

			// First, get the information from search grounding
			const { text, sources, providerMetadata } = await generateText({
				model,
				system: `You are a research assistant extracting specific learnings about a topic. Today is ${currentDate}.`,
				prompt: `[GOOGLE SEARCH REQUEST] ${query}
				
				Using real-time Google Search, provide a structured list of key learnings about this topic.
				
				RESPONSE FORMAT:
				- Each learning should be a specific, factual insight about the topic (1-2 sentences)
				- Include at least 15-20 distinct learnings that cover different aspects of the topic
				- Each learning should be prefixed with "LEARNING: " to make parsing easier
				- After all learnings, list all source URLs prefixed with "SOURCE: "
				
				Focus on factual information, recent developments, different perspectives, and key concepts.`
			});

			// Parse learnings from the response
			const learnings = text
				.split('\n')
				.filter(line => line.trim().startsWith('LEARNING:'))
				.map(line => line.replace('LEARNING:', '').trim());

			// Extract URLs
			const visitedUrls: string[] = [];

			// First try to get URLs from the AI's formatted response
			const sourceLines = text
				.split('\n')
				.filter(line => line.trim().startsWith('SOURCE:'))
				.map(line => line.replace('SOURCE:', '').trim());

			if (sourceLines.length > 0) {
				visitedUrls.push(...sourceLines);
			}

			// Then add any URLs from the sources metadata
			if (sources && Array.isArray(sources)) {
				sources.forEach(source => {
					if (source.url && !visitedUrls.includes(source.url)) {
						visitedUrls.push(source.url);
					}
				});
			}

			// Extract metadata for additional source information
			const extractedMetadata = extractSearchMetadata(providerMetadata);
			if (extractedMetadata.sources && Array.isArray(extractedMetadata.sources)) {
				extractedMetadata.sources.forEach(source => {
					if (source.uri && !visitedUrls.includes(source.uri)) {
						visitedUrls.push(source.uri);
					}
				});
			}

			// If we didn't get meaningful learnings, extract them from the full text
			if (learnings.length < 5) {
				console.log("Using alternative parsing for learnings (not enough LEARNING: prefixes found)");
				// Alternative parsing approach - split by bullet points or numbered items
				const alternativeLearnings = text
					.split(/\n\s*[-•*]\s*|\n\s*\d+\.\s*/)
					.filter(item => item.trim().length > 20 && !item.trim().toLowerCase().includes('source:'))
					.map(item => item.trim());

				if (alternativeLearnings.length > learnings.length) {
					console.log(`Extracted ${alternativeLearnings.length} alternative learnings`);
					return { learnings: alternativeLearnings, visitedUrls };
				}
			}

			console.log(`Direct search completed with ${learnings.length} learnings and ${visitedUrls.length} sources`);
			return { learnings, visitedUrls };
		} catch (error) {
			console.error("Error in direct search:", error);
			// Return empty results on error, the main workflow will still have the deep research results
			return { learnings: [], visitedUrls: [] };
		}
	}
}

export class DirectSearchWorkflow extends WorkflowEntrypoint<Env, ResearchType> {
	async run(event: WorkflowEvent<ResearchType>, step: WorkflowStep) {
		console.log("Starting direct search workflow");

		const { query, id } = event.payload;

		// Get current date in a readable format
		const currentDate = new Date().toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		try {
			console.log("Generating report with search grounding");
			const report = await step.do("generate report with search", async () => {
				const model = getSearch(this.env);

				const { text, sources, providerMetadata } = await generateText({
					model,
					// Add a clear system message to set expectations with current date
					system: `You are a professional research system that produces direct, formal reports without any acknowledgments, meta-commentary, or self-references. Begin reports immediately with substantive content. Today is ${currentDate}.`,
					prompt: `[GOOGLE SEARCH REQUEST] ${query}
		
		Using both your knowledge and real-time Google Search:
  
		<<FORMAT_INSTRUCTIONS>>
		* Start DIRECTLY with the report title followed by executive summary
		* Do NOT include phrases like "I will provide" or "Here is a report on"
		* Do NOT refer to yourself or the reader in any way
		* Do NOT acknowledge instructions or explain your approach
		* Include ONLY the substantive report content
		* Cite source names in-line when referencing specific information
		* No introductory or concluding meta-commentary
		<<END_FORMAT_INSTRUCTIONS>>
		
		Research Framework:
		1. CONDUCT THOROUGH RESEARCH:
		- Gather comprehensive, current information on this topic
		- Consider multiple perspectives and sources
		- Identify key facts, concepts, trends, and developments
		- Evaluate the reliability and relevance of information
		- Fill knowledge gaps with current data from search results
		- Keep in mind that today's date is ${currentDate} when evaluating timeliness of information
		
		2. SYNTHESIZE AND ANALYZE:
		- Integrate information from multiple sources
		- Identify patterns, relationships, and contradictions
		- Differentiate between established facts and contested claims
		- Consider historical context and future implications
		- Evaluate strengths and limitations of current understanding
		
		3. REPORT STRUCTURE:
		- Title: Clear, descriptive title for the report
		- Executive Summary: Key findings and conclusions (2-3 paragraphs)
		- Background: Essential context and historical perspective
		- Main Analysis: Systematic examination of all relevant aspects
		- Current Developments: Recent findings, breakthroughs, or changes as of ${currentDate}
		- Perspectives: Major viewpoints and debates in the field
		- Implications: Practical significance and future outlook
		
		DO NOT include a sources section - this will be added automatically. For each fact or claim from external sources, mention the source name in the text (e.g., "According to Amnesty International...").`,
				});

				// Rest of the code remains the same...
				let finalReport = text;

				// Remove any existing sources section that might have been generated by the model
				finalReport = finalReport.replace(/\n\n#+\s*(?:sources|references|citations|bibliography|works cited)(?:[\s\S]*?)(?=\n\n#+|$)/i, '');

				// Add our own sources section with URLs, using the direct sources property
				if (sources && Array.isArray(sources) && sources.length > 0) {
					const sourcesSection = `\n\n## Sources\n\n${sources.map((source, i) => {
						const title = source.title || 'Untitled';
						const url = source.url || 'No URL provided';

						// Only showing the URL once as a link
						return `${i + 1}. **[${title}](${url})**\n`;
					}).join('\n')}`;

					finalReport += sourcesSection;
				} else {
					// Fallback to search queries if direct sources aren't available
					const extractedMetadata = extractSearchMetadata(providerMetadata);
					const groundingData = extractedMetadata.groundingMetadata;

					if (groundingData && groundingData.webSearchQueries) {
						const queries = groundingData.webSearchQueries;
						finalReport += `\n\n## Search Queries Used\n\n${queries.map(q => `- ${q}`).join('\n')}`;
					}

					finalReport += "\n\n## Note\n\nThis research was conducted with search grounding enabled, but detailed source URLs were not provided in the response. Please review the search queries used and consider conducting additional research for specific sources.";
				}

				return finalReport;
			});
			// Update database with the completed report
			const qb = new D1QB(this.env.DB);
			await qb
				.update({
					tableName: "researches",
					data: { status: 2, result: report },
					where: { conditions: "id = ?", params: [id] },
				})
				.execute();

			console.log("Direct search workflow finished!");
			return { success: true };
		} catch (error) {
			console.error("Error in direct search workflow:", error);

			// Update database with error status
			const qb = new D1QB(this.env.DB);
			await qb
				.update({
					tableName: "researches",
					data: {
						status: 3, // Use status 3 for error
						result: `## Error Generating Report\n\nThere was an error generating your research report. Please try again later or try modifying your research query.\n\nError details: ${error instanceof Error ? error.message : "Unknown error"}`
					},
					where: { conditions: "id = ?", params: [id] },
				})
				.execute();

			throw error;
		}
	}
}