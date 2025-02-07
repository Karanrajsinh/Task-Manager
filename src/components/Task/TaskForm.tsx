import { Drawer, DrawerContent } from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useForm } from "react-hook-form";
import { Task, taskSchema } from "@/db/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DueDateForm } from "../ui/calendar-form";
import { useProjects, useTaskMutations } from "@/hooks/useTanstackQuery";

type PropTypes = {
    task: Task;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionType: "add" | "edit";
    onTaskUpdate?: (updatedTask: Task, taskAction: "add" | "update" | "delete") => void;
};

export default function TaskForm({ task, open, setOpen, actionType, onTaskUpdate }: PropTypes) {
    const { createTask, updateTask } = useTaskMutations("f4884b9e-a943-4c08-b821-1f89e22ebbee");
    const { data: projects } = useProjects("f4884b9e-a943-4c08-b821-1f89e22ebbee");

    // Find the project corresponding to the task's projectId
    const initialProjectId = task.projectId ?? null;

    const [projectId, setProjectId] = useState<number | null>(initialProjectId);
    const [date, setDate] = useState(task.dueDate || new Date());

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Task>({
        resolver: zodResolver(taskSchema),
        defaultValues: task,
    });

    useEffect(() => {
        if (projects && task.projectId) {
            const selectedProject = projects.find((p) => p.id === task.projectId);
            setProjectId(selectedProject ? selectedProject.id : null);
        }
    }, [projects, task.projectId]);

    const onSubmit = async (data: Task) => {
        console.log("Submitting task", actionType);

        // Include projectId only if a project is selected
        const dataWithProject = projectId === null ? { ...data, projectId: null } : { ...data, projectId };
        const dataWithDueDate = { ...dataWithProject, dueDate: date };

        try {
            if (actionType === "add") {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...taskWithoutId } = dataWithDueDate;
                console.log("Creating new task", taskWithoutId);
                const newTask = await createTask.mutateAsync(taskWithoutId);
                if (onTaskUpdate && newTask) onTaskUpdate(newTask, "add");
            } else {
                console.log("Updating existing task", dataWithDueDate);
                await updateTask.mutateAsync(dataWithDueDate);
                if (onTaskUpdate) onTaskUpdate(dataWithDueDate, "update");
            }

            setOpen(false);
        } catch (error) {
            console.error("Error submitting task:", error);
        }
    };


    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="h-fit outline-none p-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3 mt-6 mx-auto gap-6 items-start flex flex-col px-4 lg:px-6 w-full lg:w-[30%]"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="capitalize font-medium lg:text-2xl">
                            {actionType} Task
                            <span className="ml-2 font-bold">on {format(date || new Date(), "PPP")}</span>
                        </h1>
                        <span className="text-primary/50">
                            {actionType === "add" ? "Plan a New Task" : "Refine Your Task Details"}
                        </span>
                    </div>

                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-primary/80">Task</label>
                            <Input {...register("title")} placeholder="Title" />
                            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                        </div>

                        <div className="flex w-full justify-between gap-2">
                            <div className="flex w-fit flex-col gap-2">
                                <label className="text-sm text-primary/80">Due Date</label>
                                <DueDateForm date={date} setDate={setDate} />
                            </div>
                            <div className="flex flex-col w-1/2 gap-2">
                                <label className="text-sm text-primary/80">Priority</label>
                                <Select
                                    onValueChange={(value) => setValue("priority", value as Task["priority"])}
                                    defaultValue={task.priority}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HIGH">High</SelectItem>
                                        <SelectItem value="URGENT">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.priority && <p className="text-red-500 text-xs">{errors.priority.message}</p>}
                            </div>
                        </div>

                        {/* Project Selection */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-primary/80">Projects</label>
                            <Select
                                onValueChange={(value) => setProjectId(value === "NO_PROJECT" ? null : Number(value))}
                                value={projectId !== null ? String(projectId) : "NO_PROJECT"}
                            >
                                <SelectTrigger>
                                    <SelectValue>
                                        {projectId === null
                                            ? "No Project"
                                            : projects?.find((p) => p.id === projectId)?.name || "Select Project"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NO_PROJECT">No Project</SelectItem>
                                    {projects?.map((project) => (
                                        <SelectItem key={project.id} value={String(project.id)}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority Selection */}


                        {/* Description Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-primary/80">Description</label>
                            <Textarea {...register("description")} placeholder="Description" />
                        </div>
                        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}

                        {/* Submit Button */}
                        <div className="justify-end flex">
                            <Button type="submit" className="w-fit px-8 bg-primary/90 text-secondary hover:bg-primary/35">
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
