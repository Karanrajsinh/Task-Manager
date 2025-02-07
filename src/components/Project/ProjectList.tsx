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
import { useUser } from '@clerk/nextjs';




export default function ProjectList() {
    const { user } = useUser();
    const userId = user?.id || '';
    const { data: projects, isLoading } = useProjects(userId);
    const [project, setProject] = useState<Project>({ ...DefaultProjectObj, userId: userId });
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

