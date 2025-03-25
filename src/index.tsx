// src/index.tsx
import { generateObject } from "ai";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { marked } from "marked";
import { D1QB } from "workers-qb";
import { z } from "zod";
import type { Env, Variables } from "./bindings";
import {
	Layout,
	CreateContent,
	ContentQuestions,
	ContentDetails,
	ContentList,
	ValidationErrorDisplay
} from "./layout/templates";
import { FOLLOWUP_QUESTIONS_PROMPT } from "./prompts";
import type { ContentRequestType, ContentRequestTypeDB } from "./types";
import { getModel, getModelThinking, getSearch, extractSearchMetadata } from "./utils";
import { generateText } from "ai";
import {
	initialContentRequestSchema,
	finalContentRequestSchema
} from "./validation";

export { ContentGenerationWorkflow } from "./workflows";

export const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", async (c, next) => {
	if (!c.get("user")) c.set("user", "educator");
	await next();
});

app.get("/", async (c) => {
	const qb = new D1QB(c.env.DB);
	const content = await qb
		.select<ContentRequestTypeDB>("educational_content")
		.where("user = ?", c.get("user"))
		.orderBy("created_at desc")
		.all();

	return c.html(
		<Layout user={c.get("user")}>
			<ContentList content={content.results} />
		</Layout>,
	);
});

app.get("/create", async (c) => {
	return c.html(
		<Layout user={c.get("user")}>
			<CreateContent />
		</Layout>,
	);
});

app.post("/create", async (c) => {
	const form = await c.req.formData();

	const formData = {
		topic: form.get("topic") as string,
		audience: form.get("audience") as string,
		format: form.get("format") as string,
		additionalInstructions: form.get("additionalInstructions") as string,
	};

	// Validate input using Zod
	const validationResult = initialContentRequestSchema.safeParse(formData);

	if (!validationResult.success) {
		// If validation fails, extract error messages
		const errorMessages = validationResult.error.errors.map(
			(err) => `${err.path.join('.')}: ${err.message}`
		);

		return c.html(
			<Layout user={c.get("user")}>
				<ValidationErrorDisplay errors={errorMessages} />
				<CreateContent formData={formData} />
			</Layout>,
		);
	}

	// Validation passed, proceed with generating follow-up questions
	const { object } = await generateObject({
		model: getModel(c.env),
		messages: [
			{ role: "system", content: FOLLOWUP_QUESTIONS_PROMPT() },
			{
				role: "user",
				content: validationResult.data.topic,
			},
		],
		schema: z.object({
			questions: z
				.string()
				.array()
				.describe(
					`Follow up questions to clarify the educational content direction, max of 5`,
				),
		}),
	});

	const questions = object.questions.slice(0, 5);

	return c.html(
		<Layout user={c.get("user")}>
			<ContentQuestions
				contentRequest={validationResult.data}
				questions={questions}
			/>
		</Layout>,
	);
});

app.post("/create/finish", async (c) => {
	try {
		const id = crypto.randomUUID();
		const form = await c.req.formData();

		// Extract topic, audience, format and additional instructions
		const topic = form.get("topic") as string;
		const audience = form.get("audience") as string;
		const format = form.get("format") as string;
		const additionalInstructions = form.get("additionalInstructions") as string || "";

		// Extract questions and answers using a different approach to avoid FormData.entries() TypeScript error
		const questions: { question: string, answer: string }[] = [];

		// Get all keys from the form data
		const keys = Array.from(new Set([...(form as any).keys()]));

		// Filter question keys and extract the index
		const questionKeys = keys.filter(key => key.startsWith("question["));

		// For each question key, find the corresponding answer
		questionKeys.forEach(key => {
			const matches = key.match(/question\[(\d+)\]/);
			if (matches && matches[1]) {
				const index = matches[1];
				const answerKey = `answer[${index}]`;

				const questionValue = form.get(key) as string;
				const answerValue = form.get(answerKey) as string;

				// Only add if both question and answer are defined
				if (questionValue && answerValue) {
					questions.push({
						question: questionValue,
						answer: answerValue
					});
				}
			}
		});

		const formData = {
			topic,
			audience,
			format,
			additionalInstructions,
			questions,
		};

		// Validate input using Zod
		const validationResult = finalContentRequestSchema.safeParse(formData);

		if (!validationResult.success) {
			// If validation fails, extract error messages
			const errorMessages = validationResult.error.errors.map(
				(err) => `${err.path.join('.')}: ${err.message}`
			);

			// Redirect back to the create page with error message
			return c.html(
				<Layout user={c.get("user")}>
					<ValidationErrorDisplay errors={errorMessages} />
					<CreateContent />
				</Layout>,
			);
		}

		// Validation passed - ensure we have non-optional properties for ContentRequestType
		const validatedData = validationResult.data;

		// Ensure all questions have required properties
		const typedQuestions = validatedData.questions.map(q => ({
			question: q.question,
			answer: q.answer
		}));

		// Create the ContentRequestType object with properly typed questions
		const obj: ContentRequestType = {
			id,
			topic: validatedData.topic,
			audience: validatedData.audience,
			format: validatedData.format,
			additionalInstructions: validatedData.additionalInstructions,
			questions: typedQuestions,
			status: 1, // In Progress
		};

		try {
			// Start the content generation workflow
			await c.env.CONTENT_GENERATION_WORKFLOW.create({
				id,
				params: obj,
			});

			// Save to database
			const qb = new D1QB(c.env.DB);
			await qb
				.insert({
					tableName: "educational_content",
					data: {
						id: obj.id,
						topic: obj.topic,
						audience: obj.audience,
						format: obj.format,
						additional_instructions: obj.additionalInstructions, // Fixed to match DB schema
						questions: JSON.stringify(obj.questions),
						status: obj.status,
						user: c.get("user"),
					},
				})
				.execute();

			// Redirect to details page
			return c.redirect(`/content/${id}`);
		} catch (error) {
			console.error("Error creating content:", error);

			const errorMessage = error instanceof Error ? error.message : "Unknown error";

			return c.html(
				<Layout user={c.get("user")}>
					<ValidationErrorDisplay errors={[
						`Error creating content: ${errorMessage}`
					]} />
					<CreateContent formData={{
						topic: validatedData.topic,
						audience: validatedData.audience,
						format: validatedData.format,
						additionalInstructions: validatedData.additionalInstructions
					}} />
				</Layout>
			);
		}
	} catch (error) {
		console.error("Form processing error:", error);

		const errorMessage = error instanceof Error ? error.message : "Unknown error";

		return c.html(
			<Layout user={c.get("user")}>
				<ValidationErrorDisplay errors={[
					`Error processing form: ${errorMessage}`
				]} />
				<CreateContent />
			</Layout>
		);
	}
});


// API endpoint to check content generation status
app.get("/api/content-status/:id", async (c) => {
	const id = c.req.param("id");
	const userId = c.get("user");

	const qb = new D1QB(c.env.DB);
	const resp = await qb
		.fetchOne<{ status: number, result: string | null }>({
			tableName: "educational_content",
			fields: ["status", "result"],
			where: {
				conditions: ["id = ?", "user = ?"],
				params: [id, userId],
			},
		})
		.execute();

	if (!resp.results) {
		return c.json({ error: "Content not found" }, 404);
	}

	return c.json({
		id,
		status: resp.results.status,
		completed: resp.results.status === 2,
		hasResult: resp.results.result !== null
	});
});

// Update the content/:id endpoint in index.tsx file

app.get("/content/:id", async (c) => {
	const id = c.req.param("id");

	const qb = new D1QB(c.env.DB);
	const resp = await qb
		.fetchOne<ContentRequestTypeDB>({
			tableName: "educational_content",
			where: {
				conditions: ["id = ?", "user = ?"],
				params: [id, c.get("user")],
			},
		})
		.execute();

	if (!resp.results) {
		throw new HTTPException(404, { message: "Content not found" });
	}

	let content;
	let contentHtml;

	if (!resp.results.result) {
		// Loading state for content being generated - this is raw HTML
		content = `
		<div class="flex flex-col items-center justify-center py-12 px-4 space-y-6 bg-gradient-to-br from-blue-50 to-primary-50 rounded-xl border border-primary-100">
		  <div class="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
			<svg class="animate-pulse w-8 h-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
			</svg>
		  </div>
		  
		  <h3 class="text-xl font-bold text-primary-800 text-center">Creating your educational content...</h3>
		  
		  <div class="loading-message text-center text-primary-700 italic transition-opacity duration-500">
			"Education is not the filling of a pail, but the lighting of a fire." — W.B. Yeats
		  </div>
		  
		  <div class="w-full max-w-md bg-white rounded-full h-2.5 mt-2">
			<div class="loading-bar bg-primary-600 h-2.5 rounded-full w-[0%] transition-all duration-1000"></div>
		  </div>
		  
		  <div class="text-sm text-primary-600 flex items-center">
			<svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			<span id="status-text">Researching and creating educational content</span>
		  </div>
		  
		  <div class="text-sm text-neutral-600 max-w-md text-center">
			We're crafting a comprehensive educational resource tailored to your specifications. This typically takes 1-2 minutes.
		  </div>
		</div>
  
		<script>
		  // Animated loading bar
		  const loadingBar = document.querySelector('.loading-bar');
		  let width = 0;
		  const maxWidth = 90; // Only go to 90% until actually complete
		  const duration = 120000; // 2 minutes in ms
		  const interval = 2000; // Update every 2 seconds
		  const increment = (maxWidth / (duration / interval));
		  
		  const loadingInterval = setInterval(() => {
			if (width < maxWidth) {
			  width += increment;
			  loadingBar.style.width = width + '%';
			} else {
			  clearInterval(loadingInterval);
			}
		  }, interval);
		  
		  // Rotating education quotes
		  const messages = [
			'"Education is not the filling of a pail, but the lighting of a fire." — W.B. Yeats',
			'"The beautiful thing about learning is that no one can take it away from you." — B.B. King',
			'"Education is the most powerful weapon which you can use to change the world." — Nelson Mandela',
			'"Tell me and I forget. Teach me and I remember. Involve me and I learn." — Benjamin Franklin',
			'"The function of education is to teach one to think intensively and to think critically." — Martin Luther King, Jr.',
			'"Education is not preparation for life; education is life itself." — John Dewey',
			'"Knowledge is power. Information is liberating. Education is the premise of progress." — Kofi Annan',
			'"The aim of education is the knowledge, not of facts, but of values." — William Inge',
			'"Education breeds confidence. Confidence breeds hope. Hope breeds peace." — Confucius',
			'"An investment in knowledge pays the best interest." — Benjamin Franklin'
		  ];
		  
		  const messageElement = document.querySelector('.loading-message');
		  let messageIndex = 0;
		  
		  setInterval(() => {
			messageIndex = (messageIndex + 1) % messages.length;
			// Fade out
			messageElement.style.opacity = 0;
			
			setTimeout(() => {
			  // Update text and fade in
			  messageElement.textContent = messages[messageIndex];
			  messageElement.style.opacity = 1;
			}, 500);
		  }, 8000);
  
		  // Add polling mechanism to check content status
		  const contentId = "${resp.results.id}";
		  const statusText = document.getElementById('status-text');
		  const pollingInterval = setInterval(async () => {
			try {
			  const response = await fetch(\`/api/content-status/\${contentId}\`);
			  if (!response.ok) throw new Error('Failed to check status');
			  
			  const data = await response.json();
			  
			  // If content is complete and has results
			  if (data.completed && data.hasResult) {
				// Update UI to show completion is imminent
				loadingBar.style.width = '100%';
				statusText.innerHTML = '<span class="text-green-600 font-medium">Content ready! Loading...</span>';
				
				// Clear all intervals
				clearInterval(pollingInterval);
				clearInterval(loadingInterval);
				
				// Reload the page after a brief delay to show the completion animation
				setTimeout(() => {
				  window.location.reload();
				}, 1500);
			  }
			} catch (error) {
			  console.error('Error checking content status:', error);
			}
		  }, 5000); // Check every 5 seconds
  
		  // Clean up intervals when user leaves page
		  window.addEventListener('beforeunload', () => {
			clearInterval(pollingInterval);
			clearInterval(loadingInterval);
		  });
		</script>
	  `;

		// For loading state, we don't need to parse it as markdown
		// Just pass it through directly
		contentHtml = content;
	} else {
		// For completed content, it's markdown, so parse it
		content = resp.results.result;
		contentHtml = await marked.parse(content);
	}

	const contentData = {
		...resp.results,
		additionalInstructions: resp.results.additional_instructions, // Map snake_case to camelCase
		questions: JSON.parse(resp.results.questions as unknown as string),
		content_html: contentHtml, // Use the correctly processed HTML
	};

	return c.html(
		<Layout user={c.get("user")}>
			<ContentDetails content={contentData} />
		</Layout>,
	);
});

export default app;