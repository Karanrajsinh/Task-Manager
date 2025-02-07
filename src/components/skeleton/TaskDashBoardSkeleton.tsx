import { Skeleton } from "@/components/ui/skeleton";

const TaskDashboardSkeleton = () => {
    return (
        <div className="min-h-screen lg:min-h-[93.5vh] bg-gray-100 dark:bg-secondary/5">
            <main className="container mx-auto px-4 py-6">
                <div className="space-y-6">
                    {/* Statistics Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-xl" />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white/50 dark:bg-primary/5 rounded-xl shadow-sm">
                                <div className="p-6 space-y-4">
                                    <Skeleton className="h-6 w-32" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-36" />
                                    </div>
                                </div>
                                <div className="p-6 h-[50vh] flex flex-col gap-4 custom-scrollbar overflow-y-auto">
                                    {[...Array(3)].map((_, i) => (
                                        <Skeleton key={i} className="h-20 rounded-lg" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/50 dark:bg-primary/5 rounded-xl shadow-sm">
                                <div className="p-6 border-b border-primary/20">
                                    <Skeleton className="h-6 w-32" />
                                </div>
                                <div className="p-6 flex flex-col gap-4">
                                    {[...Array(3)].map((_, i) => (
                                        <Skeleton key={i} className="h-16 rounded-lg" />
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/50 dark:bg-primary/5 rounded-xl shadow-sm">
                                <div className="p-6 border-b border-primary/20">
                                    <Skeleton className="h-6 w-40" />
                                </div>
                                <div className="p-6 flex max-h-[24vh] overflow-y-auto flex-col gap-4 custom-scrollbar space-y-4">
                                    {[...Array(2)].map((_, i) => (
                                        <Skeleton key={i} className="h-16 rounded-lg" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TaskDashboardSkeleton;
