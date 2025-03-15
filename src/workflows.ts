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
import { getModel, getModelThinking } from "./utils";
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
		prompt: `Using the prompt <prompt>${prompt}</prompt>, write a detailed final report (3+ pages) that includes all the following learnings and properly cites the provided sources.
            
<instructions>
  1. Incorporate all the learnings below into a cohesive, well-structured report
  2. Cite the sources throughout your report using [Source X] notation where X is the source number
  3. When discussing information from a specific source, include the appropriate citation
  4. Ensure EVERY major claim or piece of information has a source citation
  5. Include a comprehensive "Sources" section at the end with the heading "## Sources"
  6. In the Sources section, list each source on a separate line using EXACTLY this format:
     X. [Full URL]
     Where X is the source number and [Full URL] is the complete URL
  7. DO NOT convert URLs into descriptive text or paragraphs - the full, clickable URL must be visible
  8. The final report should be detailed, informative, and academically rigorous
  9. Output ONLY the report with no introduction or acknowledgment text
</instructions>

<example_sources_section>
## Sources

1. https://example.com/research/paper1
2. https://example.org/study/methodology
3. https://research-journal.com/articles/12345
</example_sources_section>

<learnings>
${learningsString}
</learnings>

<sources>
${visitedUrls.map((url, i) => `${i + 1}. ${url}`).join("\n")}
</sources>

Remember: The Sources section at the end MUST follow the exact numbered list format shown in the example, with each complete URL on its own line. This formatting is critical and non-negotiable.`,
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
