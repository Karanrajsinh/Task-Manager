"use client"

import React, { useState, JSX } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DefaultTaskObj, Task } from '@/db/validation';
import TaskCard from './Task/TaskCard';
import TaskForm from './Task/TaskForm';
import { useMonthTasks } from '@/hooks/useTanstackQuery';
import { useQueryClient } from '@tanstack/react-query';
import TaskCalendarSkeleton from './skeleton/TaskCalendarSkeleton';
import { useUser } from '@clerk/nextjs';

interface CalendarDay {
    date: Date;
    tasks: Task[];
}

const TaskCalendarWidget: React.FC = () => {

    const { user } = useUser();
    const userId = user?.id || '';
    const [date, setDate] = useState(new Date());
    const [actionType, setActionType] = useState<'add' | 'edit'>('edit');
    const [open, setOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
    const [currentDayTasks, setCurrentDayTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [taskData, setTaskData] = useState<Task>({ ...DefaultTaskObj, userId: userId });

    const { data: monthTasks = [], isLoading } = useMonthTasks(
        userId,
        date
    );

    const queryClient = useQueryClient()

    const updateTaskInCalendar = (updatedTask: Task, taskAction: "add" | "update" | "delete") => {
        setCurrentDayTasks((prevTasks) => {
            switch (taskAction) {
                case "add":
                    return [...prevTasks, updatedTask];
                case "update":
                    return prevTasks.reduce((acc, task) => {
                        if (task.id === updatedTask.id) {
                            // If due date changed, remove it from current day's list
                            if (
                                updatedTask.dueDate &&
                                task.dueDate &&
                                updatedTask.dueDate.getTime() !== task.dueDate.getTime()
                            ) {
                                return acc;
                            }
                            return [...acc, updatedTask]; // Otherwise, update it
                        }
                        return [...acc, task]; // Keep other tasks unchanged
                    }, [] as Task[]);

                case "delete":
                    queryClient.invalidateQueries({ queryKey: ['tasks', userId, 'month', date.getFullYear(), date.getMonth()] })
                    return prevTasks.filter(task => task.id !== updatedTask.id);

                default:
                    return prevTasks;
            }
        });
        console.log(currentDayTasks)
    };


    const changeMonth = (direction: number): void => {
        setDate(prevDate => {
            const newDate = new Date(prevDate); // Use previous date, not new Date()
            newDate.setMonth(newDate.getMonth() + direction);
            return newDate;
        });
    };




    const openDayDetails = (tasks: Task[]): void => {

        setCurrentDayTasks(tasks);
        setIsTaskModalOpen(true);
    };

    const renderTaskModal = (): JSX.Element | null => {

        return (
            <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Tasks on {selectedDate?.toLocaleDateString("default", { month: "long", day: "numeric", year: "numeric" })}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 flex flex-col gap-4 mt-4">
                        {currentDayTasks.length > 0 ? (
                            currentDayTasks.map((task) =>
                                <TaskCard key={task.id} task={task} setOpen={setOpen} setTaskData={setTaskData} setActionType={setActionType} onTaskUpdate={updateTaskInCalendar} />)
                        ) : (
                            <p className="text-center text-gray-500">No tasks for this day.</p>
                        )}
                    </div>
                    <Button className="justify-self-end  w-fit" onClick={() => {
                        setActionType('add');
                        setTaskData({ ...DefaultTaskObj, id: Math.random(), dueDate: selectedDate });
                        setOpen(true);
                    }
                    }>+ Add Task</Button>

                </DialogContent>
            </Dialog>
        );
    };

    const generateCalendar = (): (CalendarDay | null)[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: (CalendarDay | null)[] = [];

        // Pad previous month's days
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add days of current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(year, month, i);
            const tasksForDay = monthTasks.filter(
                (task) =>
                    task.dueDate &&
                    task.dueDate.getFullYear() === date.getFullYear() &&
                    task.dueDate.getMonth() === date.getMonth() &&
                    task.dueDate.getDate() === date.getDate()
            );
            days.push({
                date,
                tasks: tasksForDay.map(task => ({
                    ...task,
                    description: task.description ?? ''
                }))
            });
        }

        const remainingDays = 7 - (days.length % 7);
        if (remainingDays < 7) {
            for (let i = 1; i <= remainingDays; i++) {
                days.push(null);
            }
        }

        return days;
    };

    const renderCalendar = (): JSX.Element => {
        const calendarDays: (CalendarDay | null)[] = generateCalendar();

        return (
            <div className="grid grid-cols-7 gap-[2px] border overflow-hidden bg-gray-200 dark:bg-primary/5">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div
                        key={index}
                        className="bg-white border-b border-primary dark:bg-secondary/50 text-center font-bold text-sm p-2 hidden sm:block"
                    >
                        {day}
                    </div>
                ))}
                {calendarDays.map((day, index) => (
                    <div
                        key={`${index}`}
                        className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 transition-colors cursor-pointer 
                            ${day
                                ?
                                'bg-white dark:bg-primary/5 hover:bg-white/60 dark:hover:bg-primary/10'
                                : 'bg-gray-100 dark:bg-primary/10'

                            }`}
                        onClick={() => {
                            if (day) openDayDetails(day.tasks);
                            setSelectedDate(day ? day.date : new Date())
                        }}
                    >
                        {day && (
                            <>
                                <div className="text-xs sm:text-sm mb-1">{day.date.getDate()}</div>
                                {day.tasks.length > 0 && (
                                    <div className="space-y-1 overflow-y-auto max-h-[60px] sm:max-h-[80px]">
                                        {day.tasks.slice(0, 1).map((task) => (
                                            <div
                                                key={task.id}
                                                className="text-xs p-1 sm:p-1.5 rounded transition-colors bg-primary/10 "
                                            >
                                                <span className="line-clamp-1">{task.title}</span>
                                                {day.tasks.length > 1 && (
                                                    <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                                                        +{day.tasks.length - 1} more
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (isLoading) return <TaskCalendarSkeleton />

    return (
        <Card className="w-full min-h-screen lg:min-h-[93.5vh] rounded-none dark:bg-secondary/5 shadow-none border-none max-w-screen">
            <CardHeader className="p-2 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <CardTitle className="text-lg sm:text-xl">Task Calendar</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={() => changeMonth(-1)} className="h-8 w-8">
                            <FaChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="font-bold text-sm min-w-[120px] sm:min-w-[140px] text-center">
                            {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </div>
                        <Button variant="outline" size="icon" onClick={() => changeMonth(1)} className="h-8 w-8">
                            <FaChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">{renderCalendar()}</CardContent>
            {renderTaskModal()}
            <TaskForm key={taskData.id} task={taskData} open={open} setOpen={setOpen} actionType={actionType} onTaskUpdate={updateTaskInCalendar} />
        </Card>
    );
};

export default TaskCalendarWidget;