// src/validation.ts
import { z } from "zod";

// Common validation schema for content request parameters
export const contentRequestParamsSchema = z.object({
    topic: z
        .string()
        .min(3, "Topic must be at least 3 characters long")
        .max(1000, "Topic cannot exceed 1000 characters"),
    audience: z
        .string()
        .min(3, "Audience must be at least 3 characters long")
        .max(100, "Audience cannot exceed 100 characters"),
    format: z
        .string()
        .min(3, "Format must be at least 3 characters long")
        .max(100, "Format cannot exceed 100 characters"),
    additionalInstructions: z
        .string()
        .max(1000, "Additional instructions cannot exceed 1000 characters")
        .optional(),
});

// Types derived from the schema
export type ContentRequestParams = z.infer<typeof contentRequestParamsSchema>;

// Initial content request schema
export const initialContentRequestSchema = contentRequestParamsSchema;

// Define a strict question-answer schema
const questionSchema = z.object({
    question: z.string().min(1, "Question cannot be empty"),
    answer: z.string().min(1, "Answer cannot be empty"),
});

// Schema for the final content request
export const finalContentRequestSchema = contentRequestParamsSchema.extend({
    questions: z.array(questionSchema),
});

// Export the question schema type to ensure compatibility
export type QuestionAnswer = z.infer<typeof questionSchema>;