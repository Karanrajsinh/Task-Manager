import { SortOption, Task } from "@/db/validation";

export const sortTasks = (tasks: Task[], sortOption: SortOption): Task[] => {
    return tasks.sort((a, b) => {
        switch (sortOption) {
            case "priority":
                return (Number(b.priority) || 0) - (Number(a.priority) || 0); // Assuming priority is numeric
            case "date":
            default:
                return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
    });
};