// "use client"

// import React, { useState } from 'react';
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Plus, Pencil, Trash2, Calendar, List } from 'lucide-react';
// import { useProjectMutations, useProjects } from '@/hooks/useTanstackQuery';
// import TaskCard from './Task';
// import { DefaultProjectObj, DefaultTaskObj, Project, SortOption, Task } from '@/db/validation';
// import TaskForm from './TaskForm';
// import { BiPlus } from 'react-icons/bi';
// import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from './ui/select';

// const ProjectPage = () => {
//     const [sortBy, setSortBy] = useState<SortOption>('date');
//     const { data: projects, isLoading } = useProjects("d93f8a1c-104d-40ab-b7a8-78560f8686c4", sortBy);
//     const { createProject } = useProjectMutations("d93f8a1c-104d-40ab-b7a8-78560f8686c4")
//     const [actionType, setActionType] = useState<'add' | 'edit'>('edit');
//     const [open, setOpen] = useState(false);
//     const [taskData, setTaskData] = useState<Task>(DefaultTaskObj);
//     const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
//     const [project, setProject] = useState<Project>(DefaultProjectObj);

//     const addProject = async () => {
//         try {

//             await createProject.mutateAsync(project)
//         } catch (err) {
//             console.log(err)
//         }
//     }

//     const handleProjectAction = () => {
//         setActionType('add');
//         setTaskData(DefaultTaskObj)
//         setOpen(true)
//     }


//     if (isLoading) return (
//         <div className="flex items-center justify-center min-h-screen">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//         </div>
//     );

//     return (
//         <div className="container mx-auto p-6">
//             {/* Header Section */}
//             <div className="flex flex-col gap-4 lg:flex-row justify-between lg:items-center mb-8">
//                 <div>
//                     <h1 className="text-3xl font-bold mb-2">Projects</h1>
//                     <p className="text-muted-foreground">Manage your projects and tasks</p>
//                 </div>

//                 <div className="flex gap-4">
//                     <Button variant="outline" onClick={() => setViewMode(viewMode === 'list' ? 'board' : 'list')}>
//                         {viewMode === 'list' ? <Calendar className="h-4 w-4 mr-2" /> : <List className="h-4 w-4 mr-2" />}
//                         {viewMode === 'list' ? 'Board View' : 'List View'}
//                     </Button>
//                     <Dialog>
//                         <DialogTrigger asChild>
//                             <Button>
//                                 <Plus className="mr-2 h-4 w-4" /> New Project
//                             </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-[425px]">
//                             <DialogHeader>
//                                 <DialogTitle>Create New Project</DialogTitle>
//                             </DialogHeader>
//                             <div className="grid gap-4 py-4">
//                                 <Input
//                                     onChange={(e) => setProject((prevProj) => ({
//                                         ...prevProj,
//                                         name: e.target.value
//                                     }))}
//                                     placeholder="Project Name"
//                                 />
//                                 <Textarea
//                                     onChange={(e) => setProject((prevProj) => ({
//                                         ...prevProj,
//                                         description: e.target.value
//                                     }))}
//                                     placeholder="Project Description"
//                                 />
//                                 <Button onClick={addProject}>Create Project</Button>
//                             </div>
//                         </DialogContent>
//                     </Dialog>
//                 </div>
//             </div>

//             {/* Project Grid/List View */}
//             <div className={viewMode === 'list' ? 'space-y-6' : 'grid md:grid-cols-2 gap-6'}>
//                 {projects?.map((project) => (
//                     <Card key={project.id}>
//                         <CardHeader className="pb-4">
//                             <div className="flex justify-between items-center">
//                                 <div>
//                                     <CardTitle className="text-xl mb-1">{project.name}</CardTitle>
//                                     <p className="text-sm text-muted-foreground">
//                                         {project.tasks?.length || 0} tasks
//                                     </p>
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <Button variant="ghost" size="icon">
//                                         <Pencil className="h-4 w-4" />
//                                     </Button>
//                                     <Button variant="ghost" className='bg-primary/80 hover:bg-primary/70 hover:text-secondary text-secondary' size="icon">
//                                         <Trash2 className="h-4 w-4 " />
//                                     </Button>
//                                 </div>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             {project.description && (
//                                 <p className="text-muted-foreground mb-4 text-sm">
//                                     {project.description}
//                                 </p>
//                             )}

//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="font-semibold">Tasks</h3>
//                                 <div className='flex gap-2'>
//                                     <Select
//                                         value={sortBy}
//                                         onValueChange={(value: SortOption) => setSortBy(value)}
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue>
//                                                 {sortBy}
//                                             </SelectValue>
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="date">Date</SelectItem>
//                                             <SelectItem value="priority">Priority</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <Button onClick={handleProjectAction} className='flex bg-transparent lg:bg-secondary justify-center items-center' variant='secondary'>
//                                         <span className='hidden lg:block'>Add Task</span>
//                                         <BiPlus />
//                                     </Button>
//                                 </div>

//                             </div>

//                             <div className="space-y-3 max-h-[400px] flex flex-col gap-4 custom-scrollbar overflow-y-auto pr-2">
//                                 {project?.tasks?.map((task) => (
//                                     <TaskCard
//                                         key={task.id}
//                                         setTaskData={setTaskData}
//                                         setActionType={setActionType}
//                                         task={task}
//                                         setOpen={setOpen}
//                                     />
//                                 ))}
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>

//             <TaskForm
//                 key={taskData.id}
//                 task={taskData}
//                 open={open}
//                 setOpen={setOpen}
//                 actionType={actionType}
//             />
//         </div>
//     );
// };

// export default ProjectPage;

"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useTanstackQuery';
import { DefaultProjectObj, Project } from '@/db/validation';
import ProjectCard from './ProjectCard';
import { BiPlus } from 'react-icons/bi';
import ProjectForm from './ProjectForm';
import { AiOutlineProject } from 'react-icons/ai';
import EmptyState from '../ui/EmptyState';
import ProjectListSkeleton from '../skeleton/ProjectListSkeleton';




export default function ProjectList() {
    const { data: projects, isLoading } = useProjects("f4884b9e-a943-4c08-b821-1f89e22ebbee");

    const [project, setProject] = useState<Project>(DefaultProjectObj);
    const [actionType, setActionType] = useState<'add' | 'edit'>('edit');
    const [open, setOpen] = useState(false);

    const handleProjectAction = () => {
        setActionType('add');
        setProject(DefaultProjectObj)
        setOpen(true)
    }

    if (isLoading) return <ProjectListSkeleton />

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Projects</h1>
                    <p className="text-muted-foreground">Manage your projects</p>
                </div>
                <Button variant={'secondary'} onClick={handleProjectAction}>
                    <BiPlus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            {!projects?.length ?
                <EmptyState
                    icon={AiOutlineProject}
                    title="No Project"
                    message="Create your First Project"
                />
                : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects?.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            setProject={setProject}
                            setActionType={setActionType}
                            setOpen={setOpen}
                        />
                    ))}
                </div>}
            <ProjectForm key={project.id} open={open} setOpen={setOpen} project={project} setProject={setProject} actionType={actionType} />
        </div>
    );
};

