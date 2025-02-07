import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Project } from '@/db/validation';
import { useProjectMutations } from '@/hooks/useTanstackQuery';
import { useUser } from '@clerk/nextjs';

type PropTypes =
    {
        project: Project;
        setProject: React.Dispatch<React.SetStateAction<Project>>
        open: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
        actionType: "add" | "edit";
    }

export default function ProjectForm({ project, setProject, open, setOpen, actionType }: PropTypes) {

    const { user } = useUser();
    const userId = user?.id || '';
    const { createProject, updateProject } = useProjectMutations(userId);
    const addProject = async () => {

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...projectWithoutId } = project
            if (actionType === 'add') await createProject.mutateAsync({ ...projectWithoutId, userId: userId });
            else await updateProject.mutateAsync({ ...project, userId: userId })
            setOpen(false)
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='capitalize'>{actionType} Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-8 py-4">
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm ml-1 font-bold text-primary/60'>Name</label>
                        <Input
                            onChange={(e) => setProject((prev) => ({
                                ...prev,
                                name: e.target.value
                            }))}
                            value={project.name}
                            placeholder="Project Name"
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm ml-1 font-bold text-primary/60'>Descripiton</label>
                        <Textarea
                            onChange={(e) => setProject((prev) => ({
                                ...prev,
                                description: e.target.value
                            }))}
                            value={project.description}
                            placeholder="Project Description"
                        />
                    </div>
                    <Button className='capitalize justify-self-end w-fit' onClick={addProject}>{actionType} Project</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}