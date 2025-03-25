// src/utils.ts
import {
	type GoogleGenerativeAIProvider,
	createGoogleGenerativeAI,
} from "@ai-sdk/google";
import type { Env } from "./bindings";

function getGoogleProvider(env: Env): GoogleGenerativeAIProvider {
	const args = {
		apiKey: env.GOOGLE_API_KEY,
	};

	if (env.AI_GATEWAY_ACCOUNT_ID && env.AI_GATEWAY_NAME) {
		args["baseURL"] =
			`https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_NAME}/google-ai-studio/v1beta`;

		if (env.AI_GATEWAY_API_KEY) {
			args["headers"] = {
				"cf-aig-authorization": `Bearer ${env.AI_GATEWAY_API_KEY}`,
			};
		}
	}

	return createGoogleGenerativeAI(args);
}

export function getModel(env: Env) {
	const google = getGoogleProvider(env);
	return google("gemini-2.0-flash");
}

export function getModelThinking(env: Env) {
	const google = getGoogleProvider(env);
	return google("gemini-2.0-flash-thinking-exp-01-21");
}

export function getFlashFast(env: Env) {
	const google = getGoogleProvider(env);
	return google("gemini-2.0-flash-lite");
}

export function getSearch(env: Env) {
	const google = getGoogleProvider(env);
	return google("gemini-2.0-flash", {
		useSearchGrounding: true,
	});
}

// Helper function to extract search grounding metadata from the response
export function extractSearchMetadata(providerMetadata?: any): {
	groundingMetadata?: any;
	safetyRatings?: any;
	sources?: any;
} {
	if (!providerMetadata || !providerMetadata.google) {
		return {};
	}

	const metadata = providerMetadata.google;

	// Type-safe extraction for properties
	const groundingMetadata = metadata.groundingMetadata;
	const safetyRatings = metadata.safetyRatings;

	// Extract sources
	const sources = (metadata as any).sources;

	return {
		groundingMetadata,
		safetyRatings,
		sources
	};
}

export function formatDate(date: Date): string {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	};

	return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function timeAgo(date: Date): string {
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	const intervals: [number, string][] = [
		[60, "second"],
		[60, "minute"],
		[24, "hour"],
		[7, "day"],
		[4.35, "week"],
		[12, "month"],
		[Number.POSITIVE_INFINITY, "year"],
	];

	let count = seconds;
	let unit = "second";

	for (const [interval, name] of intervals) {
		if (count < interval) break;
		count /= interval;
		unit = name;
	}

	count = Math.floor(count);
	return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
}