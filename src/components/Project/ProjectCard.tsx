import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { FaTasks } from 'react-icons/fa';
import { Project } from '@/db/validation';
import { useProjectMutations } from '@/hooks/useTanstackQuery';
import Link from 'next/link';
import { ContextMenuItem } from '@radix-ui/react-context-menu';
import { useUser } from '@clerk/nextjs';


type PropTypes =
    {
        project: Project & { taskCount: number },
        setProject: React.Dispatch<React.SetStateAction<Project>>,
        setActionType: React.Dispatch<React.SetStateAction<'add' | 'edit'>>,
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
    }

export default function ProjectCard({ project, setProject, setActionType, setOpen }: PropTypes) {

    const { user } = useUser();
    const userId = user?.id || '';
    const { deleteProject } = useProjectMutations(userId);

    const handleDelete = async () => {
        await deleteProject.mutateAsync(project.id);

    };

    const handleProjectAction = () => {
        setProject(project);
        setActionType('edit');
        setOpen(true)
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>

                <Link
                    href={`/dashboard/project/${project.id}`}
                    className="flex cursor-pointer w-full items-start bg-white/50 dark:bg-primary/5 p-4 border rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <div className="flex-1">
                        <h3 className="font-bold text-primary/80 text-lg mb-2">{project.name}</h3>
                        <div className="flex items-center mb-3">
                            <span className="text-sm flex gap-2 items-center text-primary/80">
                                <FaTasks /> {project?.taskCount || 0} tasks
                            </span>
                        </div>
                        <p className="text-sm text-primary/60 line-clamp-2">
                            {project.description || "No description provided"}
                        </p>
                    </div>
                </Link>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem className="flex w-full cursor-pointer px-2 py-1 hover:bg-primary/10 rounded-sm items-center justify-start gap-4" onClick={handleProjectAction}>
                    <MdModeEdit className='text-lg' />
                    <span>Edit</span>
                </ContextMenuItem>
                <AlertDialog>
                    <AlertDialogTrigger className="flex w-full px-2 py-1 hover:bg-primary/10 rounded-sm items-center justify-start gap-4">
                        <MdDelete className="text-lg" /> <span>Delete</span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this project and all its tasks.
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
};