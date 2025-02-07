import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/db';
import { Task, Project, SortOption } from '@/db/validation';
import { and, asc, desc, eq, gte, like, lte, SQL } from 'drizzle-orm';
import { tasks, projects } from '@/db/schema';
import { useToast } from './use-toast';
import { getErrorMessage } from "@/utils/errorMessage"


// Task Queries

// Get tasks for a user
export const useTasks = (userId: string, date?: Date) => {

    return useQuery<Task[]>({
        queryKey: ['tasks', userId, date?.toISOString()],
        queryFn: async () => {
            let tasksData = await db.query.tasks.findMany({
                where: eq(tasks.userId, userId),
            }).then(tasks => tasks.map(task => ({
                ...task,
                priority: task.priority ?? "LOW",
                description: task.description ?? "",
                dueDate: task.dueDate ?? new Date(),
                projectId: task.projectId ?? 0,
            })));

            if (date) {
                tasksData = tasksData.filter(task => {
                    const taskDate = task.dueDate as Date;
                    return (
                        taskDate.getFullYear() === date.getFullYear() &&
                        taskDate.getMonth() === date.getMonth() &&
                        taskDate.getDate() === date.getDate()
                    );
                });
            }

            return tasksData;
        },
        staleTime: 1000 * 60 * 1,
        enabled: !!userId,
    });
};

// Task mutations
export const useTaskMutations = (userId: string) => {
    const queryClient = useQueryClient();
    const { toast } = useToast()
    const createTask = useMutation({
        mutationFn: async (task: Omit<Task, 'id'>) => {
            const newTask = await db.insert(tasks).values(task).returning();
            return newTask[0];
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
            queryClient.invalidateQueries({ queryKey: ['projects', userId] });
            queryClient.invalidateQueries({ queryKey: ["projectTasks", userId] })
            toast({
                title: `Task "${data.title}" created successfully!`,
                description: `Your task "${data.title}" was added.`,
            });
        },
        onError: (error) => {
            const errorMessage = getErrorMessage(error);
            toast({
                variant: 'destructive', // Destructive for error
                title: 'Uh oh! Something went wrong.',
                description: errorMessage,
            });
        },
    });

    const updateTask = useMutation({
        mutationFn: async (task: Task) => {
            const updatedTask = await db.update(tasks).set(task).where(
                and(eq(tasks.id, task.id), eq(tasks.userId, userId))
            ).returning();
            return updatedTask[0];
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
            queryClient.invalidateQueries({ queryKey: ['projects', userId] });
            queryClient.invalidateQueries({ queryKey: ["projectTasks", userId] })
            toast({
                title: `Task "${data.title}" updated successfully!`,
                description: `The task "${data.title}" was updated.`,
            });
        },
        onError: (error) => {
            const errorMessage = getErrorMessage(error);
            toast({
                variant: 'destructive', // Destructive for error
                title: 'Uh oh! Something went wrong.',
                description: errorMessage,
            });
        },
    });

    const deleteTask = useMutation({
        mutationFn: async (taskId: number) => {
            await db.delete(tasks).where(
                and(eq(tasks.id, taskId), eq(tasks.userId, userId))
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
            queryClient.invalidateQueries({ queryKey: ['projects', userId] });
            queryClient.invalidateQueries({ queryKey: ["projectTasks", userId] })
            toast({
                title: 'Task deleted successfully!',
                description: 'The task was deleted.',
            });
        },
        onError: (error) => {
            const errorMessage = getErrorMessage(error);
            toast({
                variant: 'destructive', // Destructive for error
                title: 'Uh oh! Something went wrong.',
                description: errorMessage,
            });
        },
    });

    return { createTask, updateTask, deleteTask };
};





export const useProject = (userId: string, projectId: number) => {
    return useQuery({
        queryKey: ["project", userId, projectId],
        queryFn: async () => {
            const project = await db.query.projects.findFirst({
                where: and(eq(projects.userId, userId), eq(projects.id, projectId)),
            });

            return project;
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
};

export const useProjectTasks = (userId: string, projectId: number, sortOption: SortOption = "date") => {
    return useQuery({
        queryKey: ["projectTasks", userId, projectId, sortOption],
        queryFn: async () => {
            let orderBy;
            switch (sortOption) {
                case "priority":
                    orderBy = desc(tasks.priority);
                    break;
                case "date":
                default:
                    orderBy = asc(tasks.dueDate);
                    break;
            }

            const sortedTasks = await db.query.tasks.findMany({
                where: eq(tasks.projectId, projectId),
                orderBy: orderBy,
            });

            return sortedTasks;
        },
        staleTime: 1000 * 60, // Keep tasks fresh for 1 minute
        enabled: !!userId,
    });
};

// Extended Project mutations
export const useProjectMutations = (userId: string) => {
    const queryClient = useQueryClient();
    const { toast } = useToast()

    const createProject = useMutation({
        mutationFn: async (project: Omit<Project, 'id'>) => {
            const newProject = await db.insert(projects).values(project).returning();
            return newProject[0];
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projects', userId] });
            queryClient.invalidateQueries({ queryKey: ['project', userId] });
            toast({
                title: `Project "${data.name}" created successfully!`,
                description: `The project "${data.name}" was created.`,
            });
        },
        onError: (error) => {
            const errorMessage = getErrorMessage(error);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: errorMessage,
            });
        },
    });

    const updateProject = useMutation({
        mutationFn: async (project: Project) => {
            const updatedProject = await db.update(projects)
                .set(project)
                .where(and(eq(projects.id, project.id), eq(projects.userId, userId)))
                .returning();
            return updatedProject[0];
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projects', userId] });
            queryClient.invalidateQueries({ queryKey: ['project', userId] });
            toast({
                title: `Project "${data.name}" updated successfully!`,
                description: `The project "${data.name}" was updated.`,
            });
        },
        onError: (error) => {
            const errorMessage = getErrorMessage(error);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: errorMessage,
            });
        },
    });

    const deleteProject = useMutation({
        mutationFn: async (projectId: number) => {
            // First, delete all tasks associated with this project
            await db.delete(tasks).where(and(eq(tasks.projectId, projectId), eq(tasks.userId, userId)));
            // Then delete the project
            await db.delete(projects).where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', userId] });
            queryClient.invalidateQueries({ queryKey: ['project', userId] });
            queryClient.invalidateQueries({ queryKey: ['tasks', userId] }); // Invalidate tasks as well
            toast({
                title: 'Project deleted successfully!',
                description: 'The project and its associated tasks were deleted.',
            });
        },
        onError: (error) => {
            const errorMessage = getErrorMessage(error);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: errorMessage,
            });
        },
    });

    return { createProject, updateProject, deleteProject };
};



export const useProjects = (userId: string) => {
    return useQuery({
        queryKey: ['projects', userId],
        queryFn: async () => {
            const projectsWithTaskCount = await db.query.projects.findMany({
                where: eq(projects.userId, userId),
                with: {
                    tasks: true, // Fetch associated tasks
                },
            });

            // Map projects to include task count
            return projectsWithTaskCount.map(project => ({
                ...project,
                taskCount: project.tasks.length,
            }));
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
};

export const useProjectNames = (userId: string) => {
    return useQuery({
        queryKey: ['projectNames', userId],
        queryFn: async () => {
            const projectNames = await db.query.projects.findMany({
                where: eq(projects.userId, userId),
                columns: {
                    id: true,
                    name: true,
                },
            });
            return projectNames;
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
};

// Task Search and Filter Interface
interface TaskSearchParams {
    searchTerm?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    projectId?: number;
    sortBy?: 'dueDate' | 'priority' | 'title';
    sortOrder?: 'asc' | 'desc';
    startDate?: Date;
    endDate?: Date;
}

// Task Search Query
export const useTaskSearch = (userId: string, params: TaskSearchParams) => {
    return useQuery({
        queryKey: ['tasks', userId, 'search', params],
        queryFn: async () => {
            // Create an array of SQL conditions
            const conditions: SQL[] = [eq(tasks.userId, userId)];

            if (params.searchTerm) {
                conditions.push(like(tasks.title, `%${params.searchTerm}%`));
            }

            if (params.priority) {
                conditions.push(eq(tasks.priority, params.priority));
            }

            if (params.projectId) {
                conditions.push(eq(tasks.projectId, params.projectId));
            }

            if (params.startDate) {
                conditions.push(gte(tasks.dueDate, params.startDate));
            }

            if (params.endDate) {
                conditions.push(lte(tasks.dueDate, params.endDate));
            }

            // Determine order by configuration
            let orderBy: SQL | undefined;
            if (params.sortBy) {
                const sortOrder = params.sortOrder === 'desc' ? desc : asc;
                switch (params.sortBy) {
                    case 'dueDate':
                        orderBy = sortOrder(tasks.dueDate);
                        break;
                    case 'priority':
                        orderBy = sortOrder(tasks.priority);
                        break;
                    case 'title':
                        orderBy = sortOrder(tasks.title);
                        break;
                }
            }

            const result = await db
                .select()
                .from(tasks)
                .where(and(...conditions))
                .leftJoin(projects, eq(tasks.projectId, projects.id))
                .orderBy(orderBy || asc(tasks.dueDate)) // Default sort by due date ascending if no sort specified
                .$dynamic();

            // Transform the result to include project as a nested object
            return result.map(row => {
                const task = {
                    ...row.tasks,
                    project: row.projects ? {
                        ...row.projects
                    } : null
                };
                return task;
            });
        },
        staleTime: 1000 * 60 * 1, // Cache for 1 minute
        enabled: !!userId,
    });
};


// // Add this to your existing hooks.ts file
export const useMonthTasks = (userId: string, date: Date) => {
    return useQuery({
        queryKey: ['tasks', userId, 'month', date.getFullYear(), date.getMonth()],
        queryFn: async () => {
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const monthTasks = await db.query.tasks.findMany({
                where: and(
                    eq(tasks.userId, userId),
                    // Filter tasks within the month's date range
                    gte(tasks.dueDate, monthStart),
                    lte(tasks.dueDate, monthEnd)
                ),
            });

            return monthTasks;
        },
        staleTime: 1000 * 60 * 5,  // Cache for 5 minutes
        enabled: !!userId,  // Only fetch if userId is available
    });
};