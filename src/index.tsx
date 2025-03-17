import { generateObject } from "ai";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { marked } from "marked";
import { D1QB } from "workers-qb";
import { z } from "zod";
import type { Env, Variables } from "./bindings";
import {
	CreateResearch,
	Layout,
	NewResearchQuestions,
	ResearchDetails,
	ResearchList,
	DirectSearch,
	PrivacyPolicy,
	HowItWorks,
	ValidationErrorDisplay,
	LicenseTerms,
} from "./layout/templates";
import { FOLLOWUP_QUESTIONS_PROMPT } from "./prompts";
import type { ResearchType, ResearchTypeDB } from "./types";
import { getModel, getFlashFast } from "./utils";
import { generateText } from "ai";
import {
	researchParamsSchema,
	initialResearchSchema,
	finalResearchSchema,
	directSearchSchema
} from "./validation";

export { ResearchWorkflow, DirectSearchWorkflow } from "./workflows";

export const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", async (c, next) => {
	if (!c.get("user")) c.set("user", "unknown");

	await next();
});

app.get("/", async (c) => {
	const qb = new D1QB(c.env.DB);
	const researches = await qb
		.select<ResearchTypeDB>("researches")
		.where("user = ?", c.get("user"))
		.orderBy("created_at desc")
		.all();

	const res = researches.results;

	return c.html(
		<Layout user={c.get("user")}>
			<ResearchList researches={researches} />
		</Layout>,
	);
});

app.get("/create", async (c) => {
	return c.html(
		<Layout user={c.get("user")}>
			<CreateResearch />
		</Layout>,
	);
});

app.post("/create", async (c) => {
	const form = await c.req.formData();

	const formData = {
		query: form.get("query") as string,
		depth: form.get("depth") as string,
		breadth: form.get("breadth") as string,
	};

	// Validate input using Zod
	const validationResult = initialResearchSchema.safeParse(formData);

	if (!validationResult.success) {
		// If validation fails, extract error messages and render the form again with errors
		const errorMessages = validationResult.error.errors.map(
			(err) => `${err.path.join('.')}: ${err.message}`
		);

		return c.html(
			<Layout user={c.get("user")}>
				<ValidationErrorDisplay errors={errorMessages} />
				<CreateResearch formData={formData} />
			</Layout>,
		);
	}

	// Validation passed, proceed with the original logic
	const { object } = await generateObject({
		model: getModel(c.env),
		messages: [
			{ role: "system", content: FOLLOWUP_QUESTIONS_PROMPT() },
			{
				role: "user",
				content: validationResult.data.query,
			},
		],
		schema: z.object({
			questions: z
				.string()
				.array()
				.describe(
					`Follow up questions to clarify the research direction, max of 5`,
				),
		}),
	});

	const questions = object.questions.slice(0, 5);

	return c.html(
		<Layout user={c.get("user")}>
			<NewResearchQuestions research={validationResult.data} questions={questions} />
		</Layout>,
	);
});

app.post("/create/finish", async (c) => {
	const id = crypto.randomUUID();
	const form = await c.req.formData();

	const questions = form.getAll("question") as string[];
	const answers = form.getAll("answer") as string[];

	// Create properly typed question-answer objects
	const processedQuestions = questions.map((question, i) => ({
		question,
		answer: answers[i] || "", // Ensure we have a string, even if empty
	}));

	const formData = {
		query: form.get("query") as string,
		depth: form.get("depth") as string,
		breadth: form.get("breadth") as string,
		questions: processedQuestions,
	};

	// Validate input using Zod
	const validationResult = finalResearchSchema.safeParse(formData);

	if (!validationResult.success) {
		// If validation fails, extract error messages
		const errorMessages = validationResult.error.errors.map(
			(err) => `${err.path.join('.')}: ${err.message}`
		);

		// Redirect back to the create page with error message
		return c.html(
			<Layout user={c.get("user")}>
				<ValidationErrorDisplay errors={errorMessages} />
				<CreateResearch />
			</Layout>,
		);
	}

	// Validation passed, create the research object
	const validatedData = validationResult.data;

	// Create a properly typed questions array (explicitly create objects with required properties)
	const typedQuestions: { question: string; answer: string }[] =
		validatedData.questions.map(q => ({
			question: q.question,
			answer: q.answer
		}));

	// Create the ResearchType object with properly typed questions
	const obj: ResearchType = {
		id,
		query: validatedData.query,
		depth: String(validatedData.depth), // Convert back to string for consistency with existing code
		breadth: String(validatedData.breadth), // Convert back to string for consistency with existing code
		questions: typedQuestions, // Use our explicitly typed array
		status: 1,
	};

	await c.env.RESEARCH_WORKFLOW.create({
		id,
		params: obj,
	});

	const qb = new D1QB(c.env.DB);
	await qb
		.insert({
			tableName: "researches",
			data: {
				...obj,
				questions: JSON.stringify(obj.questions),
				user: c.get("user"),
			},
		})
		.execute();

	// Redirect to details page instead of index
	return c.redirect(`/details/${id}`);
});

// New API endpoint to check research status
app.get("/api/research-status/:id", async (c) => {
	const id = c.req.param("id");
	const userId = c.get("user");

	const qb = new D1QB(c.env.DB);
	const resp = await qb
		.fetchOne<{ status: number, result: string | null }>({
			tableName: "researches",
			fields: ["status", "result"],
			where: {
				conditions: ["id = ?", "user = ?"],
				params: [id, userId],
			},
		})
		.execute();

	if (!resp.results) {
		return c.json({ error: "Research not found" }, 404);
	}

	return c.json({
		id,
		status: resp.results.status,
		completed: resp.results.status === 2,
		hasResult: resp.results.result !== null
	});
});

app.get("/details/:id", async (c) => {
	const id = c.req.param("id");

	const qb = new D1QB(c.env.DB);
	const resp = await qb
		.fetchOne<ResearchTypeDB>({
			tableName: "researches",
			where: {
				conditions: ["id = ?", "user = ?"],
				params: [id, c.get("user")],
			},
		})
		.execute();

	if (!resp.results) {
		throw new HTTPException(404, { message: "research not found" });
	}

	let content;
	if (!resp.results.result) {
		// Custom loading state when report is not ready yet
		content = `
<div class="flex flex-col items-center justify-center py-12 px-4 space-y-6 bg-gradient-to-br from-blue-50 to-primary-50 rounded-xl border border-primary-100">
  <div class="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
    <svg class="animate-pulse w-8 h-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  </div>
  
  <h3 class="text-xl font-bold text-primary-800 text-center">Your research is brewing...</h3>
  
  <div class="loading-message text-center text-primary-700 italic transition-opacity duration-500">
    "If you think research is expensive, try ignorance." — Derek Bok
  </div>
  
  <div class="w-full max-w-md bg-white rounded-full h-2.5 mt-2">
    <div class="loading-bar bg-primary-600 h-2.5 rounded-full w-[0%] transition-all duration-1000"></div>
  </div>
  
  <div class="text-sm text-primary-600 flex items-center">
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span id="status-text">Gathering insights from across the web</span>
  </div>
  
  <div class="text-sm text-neutral-600 max-w-md text-center">
    Good things take time! Your comprehensive report is being meticulously crafted. This typically takes 5-10 minutes. 
  </div>
</div>

<script>
  // Animated loading bar
  const loadingBar = document.querySelector('.loading-bar');
  let width = 0;
  const maxWidth = 90; // Only go to 90% until actually complete
  const duration = 600000; // 10 minutes in ms
  const interval = 3000; // Update every 3 seconds
  const increment = (maxWidth / (duration / interval));
  
  const loadingInterval = setInterval(() => {
    if (width < maxWidth) {
      width += increment;
      loadingBar.style.width = width + '%';
    } else {
      clearInterval(loadingInterval);
    }
  }, interval);
  
  // Rotating witty research quotes
  const messages = [
    '"If we knew what we were doing, it wouldn\\'t be called research." — Albert Einstein',
    '"Research is what I\\'m doing when I don\\'t know what I\\'m doing." — Wernher von Braun',
    '"The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge." — Daniel J. Boorstin',
    '"If you think research is expensive, try ignorance." — Derek Bok',
    '"Research is creating new knowledge." — Neil Armstrong',
    '"Research is formalized curiosity. It is poking and prying with a purpose." — Zora Neale Hurston',
    '"The art and science of asking questions is the source of all knowledge." — Thomas Berger',
    '"The more research you do, the more at ease you are in the world." — Nick Hornby',
    '"Research is to see what everybody else has seen, and to think what nobody else has thought." — Albert Szent-Györgyi',
    '"No research without action, no action without research." — Kurt Lewin'
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

  // Add polling mechanism to check research status
  const researchId = "${resp.results.id}";
  const statusText = document.getElementById('status-text');
  const pollingInterval = setInterval(async () => {
    try {
      const response = await fetch(\`/api/research-status/\${researchId}\`);
      if (!response.ok) throw new Error('Failed to check status');
      
      const data = await response.json();
      
      // If research is complete and has results
      if (data.completed && data.hasResult) {
        // Update UI to show completion is imminent
        loadingBar.style.width = '100%';
        statusText.innerHTML = '<span class="text-green-600 font-medium">Research complete! Loading report...</span>';
        
        // Clear all intervals
        clearInterval(pollingInterval);
        clearInterval(loadingInterval);
        
        // Reload the page after a brief delay to show the completion animation
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Error checking research status:', error);
    }
  }, 5000); // Check every 5 seconds

  // Clean up intervals when user leaves page
  window.addEventListener('beforeunload', () => {
    clearInterval(pollingInterval);
    clearInterval(loadingInterval);
  });
</script>
`;
	} else {
		content = resp.results.result
			.replaceAll("```markdown", "")
			.replaceAll("```", "");
	}

	const research = {
		...resp.results,
		questions: JSON.parse(resp.results.questions as unknown as string),
		report_html: await marked.parse(content),
	};

	return c.html(
		<Layout user={c.get("user")}>
			<ResearchDetails research={research} />
		</Layout>,
	);
});

app.post("/api/suggest-answer", async (c) => {
	const body = await c.req.json();
	const question = body.question;
	const query = body.query;

	if (!question) {
		return c.json({ error: "Question is required" }, 400);
	}

	try {
		const { text } = await generateText({
			model: getFlashFast(c.env),
			messages: [
				{
					role: "system",
					content: "You are Gemini, an expert research advisor specializing in academic inquiry. Your purpose is to provide precise, evidence-based answers to follow-up questions about research topics. Your responses guide researchers with specific, actionable information.\n\nGuidelines for your answers:\n- Provide 2-3 concise paragraphs (75-150 words total)\n- Include specific methodologies, resources, or approaches when relevant\n- Cite types of evidence or data that would support the research\n- Maintain scholarly accuracy while using accessible language\n- Address the question directly without unnecessary preamble\n\nExample:\nTopic: \"The impact of social media on adolescent mental health\"\nQuestion: \"What data collection methods would be most appropriate?\"\nGood answer: \"For this research, a mixed-methods approach would yield the most comprehensive insights. Consider using validated psychological assessment tools like the Beck Depression Inventory alongside social media usage metrics. Complementing quantitative data with qualitative interviews will reveal nuances in how adolescents perceive their experiences. Focus on establishing clear causality indicators by tracking changes in mental health markers against specific platform usage patterns over time.\"\n\nDo not use markdown formatting, bullet points, or numbered lists in your responses."
				},
				{
					role: "user",
					content: `Research topic: "${query}"\nFollow-up question: "${question}"\n\nProvide a direct, evidence-informed answer to guide my research.`
				}
			]
		});

		return c.json({ answer: text });
	} catch (error) {
		console.error("Error generating answer suggestion:", error);
		return c.json({ error: "Failed to generate suggestion" }, 500);
	}
});

app.post("/api/optimize-topic", async (c) => {
	const body = await c.req.json();
	const topic = body.topic;

	if (!topic) {
		return c.json({ error: "Topic is required" }, 400);
	}

	try {
		const { text } = await generateText({
			model: getFlashFast(c.env),
			messages: [
				{
					role: "system",
					content: "You are Gemini, an AI research assistant specializing in academic topic refinement. Your only task is to transform research topics into more specific, focused, and academically rigorous statements.\n\nGuidelines:\n- Maintain the original field and core concept\n- Add precision and specificity\n- Ensure proper grammar and academic terminology\n- Provide a clear research direction\n- Aim for 10-20 words in the refined topic\n\nExamples:\nBroad: \"The effects of social media\"\nRefined: \"The impact of Instagram usage patterns on adolescent self-esteem in urban communities\"\n\nBroad: \"Climate change solutions\"\nRefined: \"Evaluating the scalability of direct air carbon capture technologies for climate mitigation\"\n\nAlways respond with only the improved topic text - no explanations, no formatting, no quotation marks."
				},
				{
					role: "user",
					content: `${topic}`
				}
			]
		});

		return c.json({ optimizedTopic: text });
	} catch (error) {
		console.error("Error optimizing topic:", error);
		return c.json({ error: "Failed to optimize topic" }, 500);
	}
});

// Route for the direct search form
app.get("/direct-search", async (c) => {
	return c.html(
		<Layout user={c.get("user")}>
			<DirectSearch />
		</Layout>,
	);
});

// Route for handling direct search submissions
app.post("/direct-search/create", async (c) => {
	const form = await c.req.formData();
	const query = form.get("query") as string;

	// Validate input using Zod
	const validationResult = directSearchSchema.safeParse({ query });

	if (!validationResult.success) {
		// If validation fails, extract error messages
		const errorMessages = validationResult.error.errors.map(
			(err) => `${err.path.join('.')}: ${err.message}`
		);

		return c.html(
			<Layout user={c.get("user")}>
				<ValidationErrorDisplay errors={errorMessages} />
				<DirectSearch formData={{ query }} />
			</Layout>,
		);
	}

	// Generate a unique ID for this research
	const id = crypto.randomUUID();

	// This is a simplified research object without depth, breadth or questions
	const obj: ResearchType = {
		id,
		query: validationResult.data.query,
		// Default values for compatibility
		depth: "3",
		breadth: "3",
		questions: [],
		status: 1,
		// Mark as a direct search for distinction if needed
		direct_search: true
	};

	// Start the direct search workflow
	await c.env.DIRECT_SEARCH_WORKFLOW.create({
		id,
		params: obj,
	});

	// Insert the research into the database
	const qb = new D1QB(c.env.DB);
	await qb
		.insert({
			tableName: "researches",
			data: {
				...obj,
				questions: JSON.stringify([]), // Empty array for questions
				user: c.get("user"),
			},
		})
		.execute();

	// Redirect to details page to show progress
	return c.redirect(`/details/${id}`);
});

app.get("/privacy", async (c) => {
	return c.html(
		<PrivacyPolicy user={c.get("user")} />
	);
});

app.get("/how-it-works", async (c) => {
	return c.html(
		<HowItWorks user={c.get("user")} />
	);
});

app.get("/license-terms", async (c) => {
	return c.html(
		<LicenseTerms user={c.get("user")} />
	);
});

export default app;