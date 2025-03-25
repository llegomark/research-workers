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

		try {
			const {
				topic,
				audience,
				format,
				additionalInstructions,
				questions,
				id
			} = event.payload;

			console.log("Workflow parameters:", {
				id,
				topic: topic.substring(0, 50) + (topic.length > 50 ? "..." : ""),
				audience,
				format,
				hasAdditionalInstructions: !!additionalInstructions,
				questionCount: questions?.length || 0
			});

			if (!id) {
				throw new Error("Missing content id");
			}

			// Format the content request
			const fullPrompt = `
  Educational Topic: ${topic}
  Target Audience: ${audience}
  Content Format: ${format}
  ${additionalInstructions ? `Additional Instructions: ${additionalInstructions}` : ''}
  
  Additional Context from Follow-up Questions:
  ${questions && questions.length > 0
					? questions.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')
					: 'No additional context provided.'
				}
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
				console.log("Updating database with completed content");
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

				console.log("Educational content generation completed successfully!");
				return {
					success: true,
					contentId: id,
					findingsCount: researchResults.findings.length,
					sourcesCount: researchResults.sources.length
				};
			} catch (error) {
				console.error("Error in educational content generation workflow:", error);
				console.error("Error details:", {
					message: error instanceof Error ? error.message : "Unknown error",
					stack: error instanceof Error ? error.stack : undefined
				});

				// Create an error report for the user
				const errorMessage = error instanceof Error ? error.message : "Unknown error";
				const errorReport = `# Error Generating Educational Content
  
  ## What Happened
  
  There was an issue creating your educational content. This might be due to:
  - Temporary service disruption
  - API connection issue
  - Content processing error
  
  ## Error Details
  
  Error: ${errorMessage}
  
  ## Next Steps
  
  1. **Try again later** - This might be a temporary issue
  2. **Simplify your request** - Try a more focused educational topic 
  3. **Contact support** if the problem persists
  
  ---
  
  *This is an automatically generated error report.*
  `;

				// Update database with error status
				try {
					console.log("Updating database with error status");
					const qb = new D1QB(this.env.DB);
					await qb
						.update({
							tableName: "educational_content",
							data: {
								status: 3, // Error
								result: errorReport
							},
							where: { conditions: "id = ?", params: [id] },
						})
						.execute();
					console.log("Database updated with error status");
				} catch (dbError) {
					console.error("Error updating database with error status:", dbError);
				}

				// Re-throw the original error for workflow tracking
				throw error;
			}
		} catch (error) {
			console.error("Critical workflow error:", error);
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
			// Check if model and API key are correctly configured
			if (!this.env.GOOGLE_API_KEY) {
				console.error("Missing GOOGLE_API_KEY environment variable");
				throw new Error("API key not configured. Please set GOOGLE_API_KEY environment variable.");
			}

			const model = getSearch(this.env);
			console.log("Model initialized successfully");

			// Get information from search grounding
			console.log("Executing search grounding API call");
			const { text, sources, providerMetadata } = await generateText({
				model,
				system: EDUCATIONAL_RESEARCH_PROMPT(),
				prompt: `[GOOGLE SEARCH REQUEST] ${prompt}
		  
		  Using real-time Google Search, gather comprehensive information on this educational topic to help create valuable content for education professionals. Focus on evidence-based practices, current research, practical applications, and implementation strategies.`,
			});
			console.log("Search grounding API call successful");

			// Parse findings from the response
			console.log("Parsing findings from response");
			const findings: string[] = [];
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

			console.log(`Parsed ${findings.length} findings from response`);

			// Extract URLs with error handling
			console.log("Extracting source URLs");
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

			console.log(`Extracted ${visitedUrls.length} source URLs`);

			// Fallback when no findings or sources are found
			if (findings.length === 0) {
				console.warn("No findings were parsed from the API response. Using default finding.");
				findings.push("FINDING: The search did not return specific structured findings. Please review the generated content for information.\nSOURCE: Generated content\nRELEVANCE: Provides general information on the topic.");
			}

			if (visitedUrls.length === 0) {
				console.warn("No sources were found in the API response. Using placeholder source.");
				visitedUrls.push("https://edu.google.com/");
			}

			console.log(`Research completed with ${findings.length} findings and ${visitedUrls.length} sources`);
			return { findings, sources: visitedUrls };
		} catch (error) {
			// Enhanced error logging
			console.error("Error in research phase:", error);
			console.error("Error details:", {
				message: error instanceof Error ? error.message : "Unknown error",
				stack: error instanceof Error ? error.stack : "No stack trace available"
			});

			// Return minimal results instead of throwing, so workflow can continue
			return {
				findings: [
					"FINDING: An error occurred during the research phase. Using minimal educational content instead.\nSOURCE: System generated\nRELEVANCE: Ensures content generation can continue despite research issues."
				],
				sources: ["https://edu.google.com/"]
			};
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
			// Verify findings and sources
			if (!findings || findings.length === 0) {
				console.warn("No findings provided to content generator. Using placeholder content.");
				findings = [
					"FINDING: Placeholder content is being generated due to missing research findings.\nSOURCE: System generated\nRELEVANCE: Provides minimal content to fulfill the request."
				];
			}

			if (!sources || sources.length === 0) {
				console.warn("No sources provided to content generator. Using placeholder source.");
				sources = ["https://edu.google.com/"];
			}

			// Format the findings as a structured input
			const formattedFindings = findings.join('\n\n');

			// Format the sources as a structured input
			const formattedSources = sources.map((url, index) => `${index + 1}. ${url}`).join('\n');

			console.log("Generating educational content with thinking model");
			console.log(`Input summary: ${prompt.length} chars prompt, ${findings.length} findings, ${sources.length} sources`);

			// Check if model is correctly configured
			if (!this.env.GOOGLE_API_KEY) {
				throw new Error("API key not configured. Please set GOOGLE_API_KEY environment variable.");
			}

			// Generate content
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

			console.log("Content generation successful");

			// Create a final markdown document with proper source attribution
			let finalContent = text;

			// If the content doesn't already include a sources/references section, add one
			const hasSources =
				finalContent.toLowerCase().includes('# reference') ||
				finalContent.toLowerCase().includes('# source') ||
				finalContent.toLowerCase().includes('## reference') ||
				finalContent.toLowerCase().includes('## source');

			if (!hasSources) {
				console.log("Adding sources section to content");
				finalContent += `\n\n## Sources\n\n`;
				sources.forEach((source, index) => {
					finalContent += `${index + 1}. ${source}\n`;
				});
			}

			return finalContent;
		} catch (error) {
			console.error("Error in content synthesis phase:", error);
			console.error("Error details:", {
				message: error instanceof Error ? error.message : "Unknown error",
				stack: error instanceof Error ? error.stack : "No stack trace available"
			});

			// Generate a minimal error report instead of throwing
			const errorMessage = error instanceof Error ? error.message : "Unknown error";

			return `# Error Generating Educational Content
  
  ## What Happened
  
  There was an issue creating your educational content. This might be due to:
  - Temporary service disruption
  - API connection issue
  - Content processing error
  
  ## Error Details
  
  Error: ${errorMessage}
  
  ## Next Steps
  
  1. **Try again later** - This might be a temporary issue
  2. **Simplify your request** - Try a more focused educational topic 
  3. **Contact support** if the problem persists
  
  ## Sources
  
  1. ${sources && sources.length > 0 ? sources[0] : "https://edu.google.com/"}
  
  ---
  
  *This is an automatically generated error report.*
  `;
		}
	}
}