'use client'
import React, { useState } from "react";
import { BsListTask, BsSearch } from 'react-icons/bs';
import { BiCalendar } from 'react-icons/bi';
import { AiOutlineProject, AiOutlineInbox } from 'react-icons/ai';
import { FiAlertCircle } from 'react-icons/fi';
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { DefaultTaskObj, Task } from "@/db/validation";
import TaskCardSkeleton from "../skeleton/TaskCardSkeleton";
import { useTasks, useProjects, useTaskSearch } from "@/hooks/useTanstackQuery";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import EmptyState from "../ui/EmptyState";
import TaskDashboardSkeleton from "../skeleton/TaskDashBoardSkeleton";
import { useUser } from "@clerk/nextjs";

const TaskDashboard = () => {
    const { user } = useUser();
    const userId = user?.id || '';
    const [actionType, setActionType] = useState<'add' | 'edit'>('edit');
    const [open, setOpen] = useState(false);
    const [taskData, setTaskData] = useState<Task>({ ...DefaultTaskObj, userId: userId });
    const [searchTerm, setSearchTerm] = useState("");
    const [priority, setPriority] = useState("");


    const { data: tasks, isLoading } = useTasks(userId, undefined);

    const { data: projects } = useProjects(userId);

    const { data: filteredTasks, isLoading: isSearchLoading } = useTaskSearch(userId, {
        searchTerm,
        priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | undefined
    });

    const todayTasks = tasks?.filter(task =>
        new Date(task.dueDate).toDateString() === new Date().toDateString()
    );

    const upcomingTasks = tasks?.filter(task =>
        new Date(task.dueDate) > new Date() &&
        new Date(task.dueDate).toDateString() !== new Date().toDateString()
    );


    if (isLoading) return <TaskDashboardSkeleton />

    return (
        <div className="min-h-screen lg:min-h-[93.5vh] bg-gray-100 dark:bg-secondary/5">
            <main className="container mx-auto px-4 py-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/50 dark:bg-primary/5 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Total Tasks</p>
                                    <h3 className="text-3xl font-bold mt-1">{tasks?.length || 0}</h3>
                                </div>
                                <BsListTask size={24} className="text-primary" />
                            </div>
                        </div>
                        <div className="bg-white/50 dark:bg-primary/5 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Total Projects</p>
                                    <h3 className="text-3xl font-bold mt-1">{projects?.length || 0}</h3>
                                </div>
                                <AiOutlineProject size={24} className="text-primary" />
                            </div>
                        </div>
                        <div className="bg-white/50 dark:bg-primary/5 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Today&apos;s Tasks</p>
                                    <h3 className="text-3xl font-bold mt-1">{todayTasks?.length || 0}</h3>
                                </div>
                                <BiCalendar size={24} className="text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white/50 dark:bg-primary/5 rounded-xl shadow-sm">
                                <div className="p-6  space-y-4">
                                    <h2 className="text-xl font-bold">My Tasks</h2>
                                    <div className="flex gap-4">
                                        <div className="flex-1 relative">
                                            <Input
                                                placeholder="Search tasks..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 border-primary/20"
                                            />
                                            <BsSearch
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                        </div>
                                        <Select value={priority} onValueChange={setPriority}>
                                            <SelectTrigger className="w-36 border-primary/20">
                                                <SelectValue placeholder="Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value=" ">All</SelectItem>
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="URGENT">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="p-6 h-[50vh] flex flex-col gap-4 custom-scrollbar overflow-y-auto">
                                    {isLoading || isSearchLoading ? (
                                        Array(3).fill(0).map((_, i) => <TaskCardSkeleton key={i} />)
                                    ) : filteredTasks?.length === 0 ? (
                                        <EmptyState
                                            icon={FiAlertCircle}
                                            title="No tasks found"
                                            message={searchTerm ? "Try different search terms" : "Start by adding some tasks"}
                                        />
                                    ) : (
                                        filteredTasks?.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                setActionType={setActionType}
                                                setTaskData={setTaskData}
                                                setOpen={setOpen}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/50 dark:bg-primary/5 rounded-xl shadow-sm">
                                <div className="p-6 border-b border-primary/20">
                                    <h2 className="text-xl font-bold">Today&apos;s Tasks</h2>
                                </div>
                                <div className="flex flex-col gap-4 p-6">
                                    {!todayTasks?.length ? (
                                        <EmptyState
                                            icon={AiOutlineInbox}
                                            title="No tasks for today"
                                            message="You're all caught up!"
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {todayTasks.map((task) => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    setActionType={setActionType}
                                                    setTaskData={setTaskData}
                                                    setOpen={setOpen}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {upcomingTasks?.length ? (
                                <div className="bg-white/50 dark:bg-primary/5 rounded-xl shadow-sm">
                                    <div className="p-6 border-b border-primary/20">
                                        <h2 className="text-xl font-bold">Upcoming Tasks</h2>
                                    </div>
                                    <div className="p-6 flex max-h-[24vh] overflow-y-auto flex-col gap-4 custom-scrollbar space-y-4">
                                        {upcomingTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                setActionType={setActionType}
                                                setTaskData={setTaskData}
                                                setOpen={setOpen}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </main>
            <TaskForm
                key={taskData.id}
                task={taskData}
                open={open}
                setOpen={setOpen}
                actionType={actionType}
            />
        </div>
    );
};

export default TaskDashboard;