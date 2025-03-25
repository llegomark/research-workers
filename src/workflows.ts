// src/workflows.ts
import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";
import { generateText } from "ai";
import { D1QB } from "workers-qb";
import type { Env } from "./bindings";
import { EDUCATIONAL_RESEARCH_PROMPT, EDUCATIONAL_SYNTHESIS_PROMPT } from "./prompts";
import type { ContentRequestType } from "./types";
import { getSearch, getModelThinking, extractSearchMetadata } from "./utils";

export class ContentGenerationWorkflow extends WorkflowEntrypoint<Env, ContentRequestType> {
	async run(event: WorkflowEvent<ContentRequestType>, step: WorkflowStep) {
		console.log("Starting educational content generation workflow");

		const {
			topic,
			audience,
			format,
			additionalInstructions,
			questions,
			id
		} = event.payload;

		// Format the content request
		const fullPrompt = `
  Educational Topic: ${topic}
  Target Audience: ${audience}
  Content Format: ${format}
  ${additionalInstructions ? `Additional Instructions: ${additionalInstructions}` : ''}
  
  Additional Context from Follow-up Questions:
  ${questions.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n')}
	  `.trim();

		try {
			// Step 1: Research using Search Grounding
			console.log("Starting research with Google Search Grounding");
			const researchResults = await step.do("research_phase", () =>
				this.performResearch(fullPrompt, step)
			);

			// Step 2: Content synthesis using Thinking model
			console.log("Generating educational content");
			const content = await step.do("synthesis_phase", () =>
				this.generateContent(fullPrompt, researchResults.findings, researchResults.sources, step)
			);

			// Step 3: Update database with completed content
			const qb = new D1QB(this.env.DB);
			await qb
				.update({
					tableName: "educational_content",
					data: {
						status: 2, // Completed
						result: content
					},
					where: { conditions: "id = ?", params: [id] },
				})
				.execute();

			console.log("Educational content generation completed!");
			return {
				success: true,
				findings: researchResults.findings,
				sources: researchResults.sources
			};
		} catch (error) {
			console.error("Error in educational content generation workflow:", error);

			// Update database with error status
			const qb = new D1QB(this.env.DB);
			await qb
				.update({
					tableName: "educational_content",
					data: {
						status: 3, // Error
						result: `## Error Generating Educational Content\n\nThere was an error generating your educational content. Please try again later or try modifying your topic.\n\nError details: ${error instanceof Error ? error.message : "Unknown error"}`
					},
					where: { conditions: "id = ?", params: [id] },
				})
				.execute();

			throw error;
		}
	}

	// Method to perform research using Google Search Grounding
	async performResearch(prompt: string, step: WorkflowStep): Promise<{ findings: string[], sources: string[] }> {
		console.log("Starting research with Google Search Grounding");

		const currentDate = new Date().toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		try {
			const model = getSearch(this.env);

			// Get information from search grounding
			const { text, sources, providerMetadata } = await generateText({
				model,
				system: EDUCATIONAL_RESEARCH_PROMPT(),
				prompt: `[GOOGLE SEARCH REQUEST] ${prompt}
		  
		  Using real-time Google Search, gather comprehensive information on this educational topic to help create valuable content for education professionals. Focus on evidence-based practices, current research, practical applications, and implementation strategies.`,
			});

			// Parse findings from the response
			const findings = [];
			const lines = text.split('\n');
			let currentFinding = "";

			for (const line of lines) {
				if (line.startsWith('FINDING:')) {
					if (currentFinding) {
						findings.push(currentFinding.trim());
					}
					currentFinding = line;
				} else if (currentFinding) {
					currentFinding += '\n' + line;
				}
			}

			if (currentFinding) {
				findings.push(currentFinding.trim());
			}

			// Extract URLs
			const visitedUrls: string[] = [];

			// First, extract source information from the findings
			findings.forEach(finding => {
				const sourceMatch = finding.match(/SOURCE:\s*(.+?)(?=\n|$)/);
				if (sourceMatch && sourceMatch[1] && !visitedUrls.includes(sourceMatch[1])) {
					visitedUrls.push(sourceMatch[1].trim());
				}
			});

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

			console.log(`Research completed with ${findings.length} findings and ${visitedUrls.length} sources`);
			return { findings, sources: visitedUrls };
		} catch (error) {
			console.error("Error in research phase:", error);
			return { findings: [], sources: [] };
		}
	}

	// Method to generate educational content using the thinking model
	async generateContent(prompt: string, findings: string[], sources: string[], step: WorkflowStep): Promise<string> {
		console.log("Generating educational content with thinking model");

		const currentDate = new Date().toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		try {
			// Format the findings as a structured input
			const formattedFindings = findings.join('\n\n');

			// Format the sources as a structured input
			const formattedSources = sources.map((url, index) => `${index + 1}. ${url}`).join('\n');

			const { text } = await generateText({
				model: getModelThinking(this.env),
				system: EDUCATIONAL_SYNTHESIS_PROMPT(),
				prompt: `Using the educational topic request below, create high-quality educational content tailored for the specified audience and format. Today's date is ${currentDate}.
		  
  TOPIC REQUEST:
  ${prompt}
  
  RESEARCH FINDINGS:
  ${formattedFindings}
  
  SOURCES:
  ${formattedSources}
  
  Create comprehensive educational content that synthesizes these research findings into a cohesive, practical resource for educators. Focus on actionable strategies, implementation guidance, and practical applications. Ensure proper attribution of information and include all relevant sources in a references section.`,
			});

			// Create a final markdown document with proper source attribution
			let finalContent = text;

			// If the content doesn't already include a sources/references section, add one
			if (!finalContent.toLowerCase().includes('# reference') &&
				!finalContent.toLowerCase().includes('# source') &&
				!finalContent.toLowerCase().includes('## reference') &&
				!finalContent.toLowerCase().includes('## source')) {

				finalContent += `\n\n## Sources\n\n`;
				sources.forEach((source, index) => {
					finalContent += `${index + 1}. ${source}\n`;
				});
			}

			return finalContent;
		} catch (error) {
			console.error("Error in content synthesis phase:", error);
			throw error;
		}
	}
}