import { z } from "zod";
import { priorityEnum } from "@/db/schema";

// Task Schema
export const taskSchema = z.object({
  id: z.number(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().default(""),
  dueDate: z.coerce.date().default(new Date()),
  priority: z.enum(priorityEnum.enumValues).default("MEDIUM"),
  projectId: z.number().optional().nullable(),
  userId: z.string().uuid(),
});

// Project Schema
export const projectSchema = z.object({
  id: z.number(),
  name: z.string().min(3, "Project name must be at least 3 characters long"),
  description: z.string().default(''),
  userId: z.string().uuid(),
});


export type SortOption = "date" | "priority";

export const DefaultTaskObj = 
{
  id : 1,
  title : '',
  description : '',
  dueDate : new Date(),
  priority: "LOW" as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
  status: "TODO" as "TODO" | "IN_PROGRESS" | "COMPLETED",
  userId : 'f4884b9e-a943-4c08-b821-1f89e22ebbee',
}

export const DefaultProjectObj = 
{
  id : 1 ,
  name : '',
  description : '',
  userId : 'f4884b9e-a943-4c08-b821-1f89e22ebbee',
}

export type Task = z.infer<typeof taskSchema>;
export type Project = z.infer<typeof projectSchema>;

