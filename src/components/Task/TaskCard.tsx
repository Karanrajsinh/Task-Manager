import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { MdDelete } from "react-icons/md";
import { Checkbox } from "../ui/checkbox";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "../ui/context-menu";
import { Task } from "@/db/validation";
import React from "react";
import { format } from "date-fns";
import { FaFlag } from "react-icons/fa";
import { useTaskMutations } from "@/hooks/useTanstackQuery";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/errorMessage";
import { useUser } from "@clerk/nextjs";

type PropTypes = {
    task: Task,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setActionType: React.Dispatch<React.SetStateAction<'add' | 'edit'>>,
    setTaskData: React.Dispatch<React.SetStateAction<Task>>,
    onTaskUpdate?: (updatedTask: Task, taskAction: "add" | "update" | "delete") => void
};

export default function TaskCard({ task, setTaskData, setOpen, setActionType, onTaskUpdate }: PropTypes) {
    const { user } = useUser();
    const userId = user?.id || '';
    const { deleteTask } = useTaskMutations(userId);
    const { toast } = useToast()
    const handleDelete = async () => {
        try {
            await deleteTask.mutateAsync(task.id);
            if (onTaskUpdate) onTaskUpdate(task, "delete");

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: getErrorMessage(error)
            });
        }
    };

    return (
        <ContextMenu key={task.id}>
            <ContextMenuTrigger>
                <div key={task.id} className="flex cursor-pointer w-full items-center bg-white/50 dark:bg-primary/5 gap-4 p-4 border rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <Checkbox
                        className="h-5 w-5"
                        onCheckedChange={(checked) => {
                            if (checked) handleDelete();
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div
                        className="flex-1"
                        onClick={() => {
                            setActionType('edit');
                            setTaskData(task);
                            setOpen(true);
                        }}
                    >
                        <h3 className="font-bold shrink-0 text-primary/80 text-sm lg:text-base">{task.title}</h3>
                        <div className="flex items-center mt-1 gap-6">
                            <span className="text-xs lg:text-sm text-primary/50">
                                {task.dueDate ? `${format(new Date(task.dueDate), "PPP")}` : "No due date"}
                            </span>
                            <span className="text-xs flex gap-2 items-center capitalize lg:text-sm text-primary/80">
                                <FaFlag /> {task.priority.toLowerCase()}
                            </span>
                        </div>
                        <p className="text-xs lg:text-sm mt-2 text-primary/60">
                            {task.description}
                        </p>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <AlertDialog>
                    <AlertDialogTrigger className="flex w-full px-2 py-1 hover:bg-primary/10 rounded-sm items-center justify-start gap-4">
                        <MdDelete className="text-lg" /> <span>Delete</span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this item
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </ContextMenuContent>
        </ContextMenu>
    );
}