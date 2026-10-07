import { z } from 'zod';

export const TaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().default(""),
  assigneeId: z.string().regex(/^DEV\d+$/, "Assignee must be an AGENT (e.g., DEV01)"),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Task deadline must be YYYY-MM-DD"),
  estimatedHours: z.number().positive("Estimated hours must be a positive number"),
});

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  clientName: z.string().min(1, "Client name is required"),
  description: z.string().default(""),
  managerId: z.string().regex(/^PM\d+$/, "Manager must be a MANAGER (e.g., PM01)"),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Project deadline must be YYYY-MM-DD"),
  tasks: z.array(TaskSchema).min(1, "Project must have at least one task"),
});

export const AiResponseSchema = z.object({
  projects: z.array(ProjectSchema).min(1, "At least one project is required"),
});
