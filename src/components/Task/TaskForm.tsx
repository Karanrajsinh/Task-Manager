import { Drawer, DrawerContent } from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { format } from "date-fns";
import { useState, FormEvent, useEffect } from "react";
import { DueDateForm } from "../ui/calendar-form";
import { useProjects, useTaskMutations } from "@/hooks/useTanstackQuery";
import { useUser } from "@clerk/nextjs";
import { Task } from "@/db/validation";

type PropTypes = {
    task: Task;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionType: "add" | "edit";
    onTaskUpdate?: (updatedTask: Task, taskAction: "add" | "update" | "delete") => void;
};

export default function TaskForm({ task, open, setOpen, actionType, onTaskUpdate }: PropTypes) {
    const { user } = useUser();
    const userId = user?.id || '';

    const { createTask, updateTask } = useTaskMutations(userId);
    const { data: projects } = useProjects(userId);

    const initialProjectId = task.projectId ?? null;
    const [projectId, setProjectId] = useState<number | null>(initialProjectId);
    const [date, setDate] = useState(task.dueDate || new Date());

    // State for form fields
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [priority, setPriority] = useState<Task['priority']>(task.priority || 'LOW');


    useEffect(() => {
        if (projects && task.projectId) {
            const selectedProject = projects.find((p) => p.id === task.projectId);
            setProjectId(selectedProject ? selectedProject.id : null);
        }
    }, [projects, task.projectId]);


    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const taskData: Task = {
            title,
            description,
            priority,
            dueDate: date,
            projectId: projectId,
            userId,
            id: task.id
        };

        try {
            if (actionType === "add") {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...taskWithoutId } = taskData;
                const newTask = await createTask.mutateAsync(taskWithoutId);
                if (onTaskUpdate && newTask) onTaskUpdate(newTask, "add");
            } else {
                await updateTask.mutateAsync(taskData);
                if (onTaskUpdate) onTaskUpdate(taskData, "update");
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
                    onSubmit={onSubmit}
                    className="space-y-3 mt-6 mx-auto gap-6 items-start flex flex-col px-4 lg:px-6 w-full lg:w-[30%]"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="capitalize font-medium lg:text-2xl">
                            {actionType} Task
                            <span className="ml-2 font-bold">on {format(date || new Date(), "PPP")}</span>
                        </h1>
                    </div>

                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-primary/80">Task</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                required
                            />
                        </div>

                        <div className="flex w-full justify-between gap-2">
                            <div className="flex w-fit flex-col gap-2">
                                <label className="text-sm text-primary/80">Due Date</label>
                                <DueDateForm date={date} setDate={setDate} />
                            </div>
                            <div className="flex flex-col w-1/2 gap-2">
                                <label className="text-sm text-primary/80">Priority</label>
                                <Select
                                    onValueChange={(value) => setPriority(value as Task['priority'])}
                                    value={priority}
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
                            </div>
                        </div>

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

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-primary/80">Description</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                            />
                        </div>

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