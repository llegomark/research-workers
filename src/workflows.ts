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
	const learningsString = learnings
		.map((l) => `<learning>\n${l}\n</learning>`)
		.join("\n");

	const { text } = await generateText({
		model: getModelThinking(env),
		system: RESEARCH_PROMPT(),
		prompt: `Using the prompt <prompt>${prompt}</prompt>, write a detailed final report (3+ pages) that includes all the following learnings. Output ONLY the report with no introduction or acknowledgment text.
            
<learnings>
${learningsString}
</learnings>

<sources>
${visitedUrls.map((url, i) => `${i + 1}. ${url}`).join("\n")}
</sources>`,
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
		console.log("Starting workflow");

		const { query, questions, breadth, depth, id } = event.payload;
		const fullQuery = `Initial Query: ${query}\nFollowup Q&A:\n${questions
			.map((q) => `Q: ${q.question}\nA: ${q.answer}`)
			.join("\n")}`;

		const browser = await getBrowser(this.env);

		console.log("Starting research...");
		const researchResult = await step.do("do research", () =>
			deepResearch({
				step,
				env: this.env,
				browser,
				query: fullQuery,
				breadth: Number.parseInt(breadth),
				depth: Number.parseInt(depth),
				learnings: [],
				visitedUrls: [],
			}),
		);

		console.log("Generating report");
		const report = await step.do("generate report", () =>
			writeFinalReport({
				env: this.env,
				prompt: fullQuery,
				learnings: researchResult.learnings,
				visitedUrls: researchResult.visitedUrls,
			}),
		);

		const qb = new D1QB(this.env.DB);
		await qb
			.update({
				tableName: "researches",
				data: { status: 2, result: report },
				where: { conditions: "id = ?", params: [id] },
			})
			.execute();

		console.log("Workflow finished!");
		return researchResult;
	}
}

export class DirectSearchWorkflow extends WorkflowEntrypoint<Env, ResearchType> {
	async run(event: WorkflowEvent<ResearchType>, step: WorkflowStep) {
		console.log("Starting direct search workflow");

		const { query, id } = event.payload;

		try {
			console.log("Generating report with search grounding");
			const report = await step.do("generate report with search", async () => {
				const model = getSearch(this.env);

				const { text, sources, providerMetadata } = await generateText({
					model,
					// Add a clear system message to set expectations
					system: "You are a professional research system that produces direct, formal reports without any acknowledgments, meta-commentary, or self-references. Begin reports immediately with substantive content.",
					prompt: `[DEEP RESEARCH REQUEST] ${query}
			
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
			- Current Developments: Recent findings, breakthroughs, or changes
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