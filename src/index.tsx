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
} from "./layout/templates";
import { FOLLOWUP_QUESTIONS_PROMPT } from "./prompts";
import type { ResearchType, ResearchTypeDB } from "./types";
import { getModel, getFlashFast } from "./utils";
import { generateText } from "ai";

export { ResearchWorkflow } from "./workflows";

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

	const research = {
		query: form.get("query") as string,
		depth: form.get("depth") as string,
		breadth: form.get("breadth") as string,
	};

	const { object } = await generateObject({
		model: getModel(c.env),
		messages: [
			{ role: "system", content: FOLLOWUP_QUESTIONS_PROMPT() },
			{
				role: "user",
				content: research.query,
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
			<NewResearchQuestions research={research} questions={questions} />
		</Layout>,
	);
});

app.post("/create/finish", async (c) => {
	const id = crypto.randomUUID();
	const form = await c.req.formData();

	const questions = form.getAll("question") as string[];
	const answers = form.getAll("answer") as string[];

	const processedQuestions = questions.map((question, i) => ({
		question,
		answer: answers[i],
	}));

	const obj: ResearchType = {
		id,
		query: form.get("query") as string,
		depth: form.get("depth") as string,
		breadth: form.get("breadth") as string,
		questions: processedQuestions,
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

	return c.redirect("/");
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

	const content = (resp.results.result ?? "Report is still running...")
		.replaceAll("```markdown", "")
		.replaceAll("```", "");

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

app.post("/re-run", async (c) => {
	const form = await c.req.formData();

	const qb = new D1QB(c.env.DB);
	const resp = await qb
		.fetchOne<ResearchTypeDB>({
			tableName: "researches",
			where: {
				conditions: ["id = ?", "user = ?"],
				params: [form.get("id") as string, c.get("user")],
			},
		})
		.execute();

	if (!resp) {
		throw new HTTPException(404, { message: "research not found" });
	}

	const obj: ResearchType = {
		id: crypto.randomUUID(),
		query: resp.results.query,
		depth: resp.results.depth,
		breadth: resp.results.breadth,
		questions: JSON.parse(resp.results.questions as unknown as string),
		status: 1,
	};

	await c.env.RESEARCH_WORKFLOW.create({
		id: obj.id,
		params: obj,
	});

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

	return c.redirect("/");
});

app.post("/delete", async (c) => {
	const form = await c.req.formData();

	const qb = new D1QB(c.env.DB);
	const resp = await qb
		.fetchOne<ResearchTypeDB>({
			tableName: "researches",
			where: {
				conditions: ["id = ?", "user = ?"],
				params: [form.get("id") as string, c.get("user")],
			},
		})
		.execute();

	if (!resp) {
		throw new HTTPException(404, { message: "research not found" });
	}

	await qb
		.delete({
			tableName: "researches",
			where: {
				conditions: ["id = ?", "user = ?"],
				params: [form.get("id") as string, c.get("user")],
			},
		})
		.execute();

	return c.redirect("/");
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
					content: "You are markllego, an AI research assistant helping users refine their research queries. Your task is to generate a helpful, specific, and relevant answer to a follow-up question about a research topic. Keep your response concise but informative, focusing on providing clear direction for the research."
				},
				{
					role: "user",
					content: `I'm planning to research: "${query}"\nPlease suggest a good answer to this follow-up question: "${question}". Do not user markdown syntax. Keep your response direct to the point, concise and informative.`
				}
			]
		});

		return c.json({ answer: text });
	} catch (error) {
		console.error("Error generating answer suggestion:", error);
		return c.json({ error: "Failed to generate suggestion" }, 500);
	}
});

export default app;
