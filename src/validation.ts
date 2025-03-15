import { z } from "zod";

// Common validation schema for research parameters
export const researchParamsSchema = z.object({
    query: z
        .string()
        .min(3, "Research query must be at least 3 characters long")
        .max(1000, "Research query cannot exceed 1000 characters"),
    depth: z
        .string()
        .refine((val) => !isNaN(Number(val)), "Depth must be a number")
        .transform(Number)
        .refine((val) => val >= 1 && val <= 5, {
            message: "Depth must be between 1 and 5",
        }),
    breadth: z
        .string()
        .refine((val) => !isNaN(Number(val)), "Breadth must be a number")
        .transform(Number)
        .refine((val) => val >= 1 && val <= 5, {
            message: "Breadth must be between 1 and 5",
        }),
});

// Types derived from the schema
export type ResearchParams = z.infer<typeof researchParamsSchema>;

// Initial research creation schema (used in /create endpoint)
export const initialResearchSchema = researchParamsSchema;

// Define a strict question-answer schema that matches the ResearchType interface
const questionSchema = z.object({
    question: z.string().min(1, "Question cannot be empty"),
    answer: z.string().min(1, "Answer cannot be empty"),
});

// Schema for the final research creation (used in /create/finish endpoint)
export const finalResearchSchema = researchParamsSchema.extend({
    questions: z.array(questionSchema),
});

// Schema for direct search (simpler requirements)
export const directSearchSchema = z.object({
    query: z
        .string()
        .min(3, "Search query must be at least 3 characters long")
        .max(1000, "Search query cannot exceed 1000 characters"),
});

// Export the question schema type to ensure compatibility
export type QuestionAnswer = z.infer<typeof questionSchema>;