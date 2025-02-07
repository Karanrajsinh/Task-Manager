// "use client"

// import React, { useState } from 'react';
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Plus, Calendar, List } from 'lucide-react';
// import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
// import TaskCard from '@/components/Task/Task'
// import TaskForm from '@/components/Task/TaskForm';
// import { DefaultTaskObj, SortOption, Task } from '@/db/validation';

// import { useParams } from 'next/navigation';
// import { useProject } from '@/hooks/useTanstackQuery';


// export default function ProjectPage() {
//     const { id } = useParams();
//     const [sortBy, setSortBy] = useState<SortOption>('date');
//     const [actionType, setActionType] = useState<'add' | 'edit'>('edit');
//     const [open, setOpen] = useState(false);
//     const [taskData, setTaskData] = useState<Task>(DefaultTaskObj);
//     const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

//     const { data: project, isLoading } = useProject('f4884b9e-a943-4c08-b821-1f89e22ebbee', Number(id), "date")

//     const handleTaskAction = () => {
//         setActionType('add');
//         setTaskData(DefaultTaskObj);
//         setOpen(true);
//     };

//     if (isLoading) return <p>Loading...</p>
//     if (project) console.log(project)

//     return (
//         <div className="container mx-auto p-6">
//             {/* Header Section */}
//             <div className="flex flex-col gap-4 lg:flex-row justify-between lg:items-center mb-8">
//                 <div>
//                     <h1 className="text-3xl font-bold mb-2">{project?.name}</h1>
//                     <p className="text-muted-foreground">{project?.description}</p>
//                 </div>

//                 <div className="flex gap-4">
//                     <Button
//                         variant="outline"
//                         onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
//                     >
//                         {viewMode === 'list' ?
//                             <Calendar className="h-4 w-4 mr-2" /> :
//                             <List className="h-4 w-4 mr-2" />
//                         }
//                         {viewMode === 'list' ? 'Calendar View' : 'List View'}
//                     </Button>
//                 </div>
//             </div>

//             {viewMode === 'list' ? (
//                 <Card>
//                     <CardHeader>
//                         <div className="flex justify-between items-center">
//                             <CardTitle className="text-xl">Tasks</CardTitle>
//                             <div className="flex gap-2">
//                                 <Select
//                                     value={sortBy}
//                                     onValueChange={(value: SortOption) => setSortBy(value)}
//                                 >
//                                     <SelectTrigger className="w-32">
//                                         <SelectValue placeholder="Sort by" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="date">Date</SelectItem>
//                                         <SelectItem value="priority">Priority</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                                 <Button onClick={handleTaskAction}>
//                                     <Plus className="h-4 w-4 mr-2" /> Add Task
//                                 </Button>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="space-y-3 max-h-[600px] flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
//                             {project?.tasks?.map((task) => (
//                                 <TaskCard
//                                     key={task.id}
//                                     setTaskData={setTaskData}
//                                     setActionType={setActionType}
//                                     task={task}
//                                     setOpen={setOpen}
//                                 />
//                             ))}
//                         </div>
//                     </CardContent>
//                 </Card>
//             ) : (
//                 <div className="bg-white rounded-lg shadow p-6">
//                     <div className="grid grid-cols-7 gap-4">
//                         {/* Calendar view implementation */}
//                         {/* You can implement the calendar view similar to the reference images */}
//                     </div>
//                 </div>
//             )}

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



"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import TaskCard from "@/components/Task/Task";
import TaskForm from "@/components/Task/TaskForm";
import { DefaultProjectObj, DefaultTaskObj, Project, SortOption, Task } from "@/db/validation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useParams, useRouter } from "next/navigation";
import { useProject, useProjectMutations, useProjectTasks } from "@/hooks/useTanstackQuery";
import ProjectForm from "./ProjectForm";
import { MdDelete, MdEdit } from "react-icons/md";
import ProjectPageSkeleton from "../skeleton/ProjectPageSkeleton";
import TaskCardSkeleton from "../skeleton/TaskCardSkeleton";
import EmptyState from "../ui/EmptyState";
import { AiOutlineInbox } from "react-icons/ai";

export default function ProjectPage() {
    const { id } = useParams();
    const router = useRouter();
    const [sortBy, setSortBy] = useState<SortOption>("date");
    const [actionType, setActionType] = useState<"add" | "edit">("edit");
    const [openTask, setOpenTask] = useState(false);
    const [openProduct, setOpenProduct] = useState(false);
    const [taskData, setTaskData] = useState<Task>(DefaultTaskObj);
    const { data: projectData, isLoading: isProjectLoading } = useProject("f4884b9e-a943-4c08-b821-1f89e22ebbee", Number(id));
    const { data: tasks, isLoading: isTasksLoading } = useProjectTasks("f4884b9e-a943-4c08-b821-1f89e22ebbee", Number(id), sortBy)
    const { deleteProject } = useProjectMutations("f4884b9e-a943-4c08-b821-1f89e22ebbee")
    const [project, setProject] = useState<Project>(DefaultProjectObj || projectData)


    const handleTaskAction = () => {
        setActionType("add");
        setTaskData({ ...DefaultTaskObj, projectId: Number(id) });
        setOpenTask(true);
    };


    const handleProjectEdit = () => {
        setActionType("edit");
        setProject(projectData || DefaultProjectObj);
        setOpenProduct(true)
    }

    const handleProjectDelete = () => {
        deleteProject.mutateAsync(Number(id)).then(() => router.push('/dashboard/project'))
    }


    if (isProjectLoading) return <ProjectPageSkeleton />


    return (
        <div className="container mx-auto p-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 lg:flex-row justify-between lg:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{projectData?.name}</h1>
                    <p className="text-muted-foreground mb-4">{projectData?.description}</p>
                    <span className="px-4 py-2 bg-muted-foreground text-secondary rounded-lg text-sm font-semibold">
                        Tasks: {tasks?.length || 0}
                    </span>
                </div>
                <div className="flex justify-end w-full lg:w-fit gap-4">
                    <Button variant='secondary' className="p-3" onClick={handleProjectEdit}><MdEdit /></Button>
                    <AlertDialog>
                        <AlertDialogTrigger className="flex bg-primary text-secondary w-fit px-2 py-1 hover:bg-primary/10 rounded-sm items-center justify-start gap-4">
                            <MdDelete />
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
                                <AlertDialogAction onClick={handleProjectDelete}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

            </div>


            {/* Tasks Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-8">
                <h2 className="text-xl font-semibold">Tasks</h2>
                <div className="flex gap-2">
                    {/* Sort By Select */}
                    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="priority">Priority</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant='secondary' className="p-2 flex items-center justify-center" onClick={handleTaskAction}>
                        <Plus className="h-4 w-4 lg:mr-2 " />
                        <span className="hidden lg:block">Add Task</span>
                    </Button>
                </div>
            </div>

            {/* Task List */}

            <div className="space-y-3 max-h-[600px]  flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                {isTasksLoading ?
                    <>
                        <TaskCardSkeleton />
                        <TaskCardSkeleton />
                        <TaskCardSkeleton />
                    </>
                    :
                    <>
                        {!tasks?.length ?
                            <EmptyState
                                icon={AiOutlineInbox}
                                title="No tasks"
                                message="Create your first task on this project"
                            />
                            : <>
                                {tasks?.map((task) => (
                                    <TaskCard key={task.id} setTaskData={setTaskData} setActionType={setActionType} task={task} setOpen={setOpenTask} />
                                ))}
                            </>
                        }
                    </>
                }
            </div>



            <TaskForm key={taskData.id} task={taskData} open={openTask} setOpen={setOpenTask} actionType={actionType} />
            <ProjectForm project={project} setProject={setProject} open={openProduct} setOpen={setOpenProduct} actionType={actionType} />
        </div >
    );
}
