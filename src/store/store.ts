
// import { create } from 'zustand';
// import { taskSchema, projectSchema, Task, Project } from '@/db/validation';

// interface TaskStore {
//   currentUser: null | { id: string; email: string; name: string };
//   selectedProject: null | Project;
//   tasks: Task[];
//   projects : Project[],
//   setCurrentUser: (user: null | { id: string; email: string; name: string }) => void;
//   setSelectedProject: (project: null | Project) => void;
//   setTasks: (tasks: Task[]) => void;
//   createTask: (task: Omit<Task, 'id'>) => Promise<Task>;
//   updateTask: (task: Task) => Promise<Task>;
//   deleteTask: (taskId: number) => Promise<void>;
//   createProject: (project: Omit<Project, 'id'>) => Promise<Project>;
// }

// export const useTaskStore = create<TaskStore>((set) => ({
//   currentUser: null,
//   selectedProject: null,
//   tasks: [],
//   projects : [],
//   setCurrentUser: (user) => set({ currentUser: user }),
//   setSelectedProject: (project) => set({ selectedProject: project }),
//   setTasks: (tasks) => set({ tasks }),
//   createTask: async (task) => {
//     const newTask = await taskSchema.parseAsync(task);
//     set((state) => ({ tasks: [...state.tasks, newTask] }));
//     return newTask;
//   },
//   updateTask: async (task) => {
//     const updatedTask = await taskSchema.parseAsync(task);
//     set((state) => ({
//       tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
//     }));
//     return updatedTask;
//   },
//   deleteTask: async (taskId) => {
//     set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }));
//   },
//   createProject: async (project) => {
//     const newProject = await projectSchema.parseAsync(project);
//     set((state) => ({ projects: [...state.projects, newProject] }));
//     return newProject;
//   },
// }));



import { create } from 'zustand'

type User = {
  id: string
  email: string
  name: string
}

type AuthStore = {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))