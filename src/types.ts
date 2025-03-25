// src/types.ts
export type ContentRequestType = {
	id: string;
	topic: string;
	audience: string;
	format: string;
	additionalInstructions?: string;
	status: number; // 1: In Progress, 2: Completed, 3: Error
	questions: {
		question: string;
		answer: string;
	}[];
	result?: string;
	created_at?: string;
};

export type ContentRequestTypeDB = {
	id: string;
	topic: string;
	audience: string;
	format: string;
	additional_instructions?: string;
	status: number;
	questions: string; // JSON string
	result?: string;
	created_at?: string;
	user?: string;
};