import { Skeleton } from "@/components/ui/skeleton";

export default function TaskCalendarSkeleton() {
    return (
        <div className="w-full min-h-screen lg:min-h-[93.5vh] rounded-none dark:bg-white/5 shadow-none border-none max-w-screen p-4">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <p className="text-lg sm:text-xl font-bold">Task Calendar</p>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-[2px] border overflow-hidden bg-gray-200 dark:bg-primary/5 ">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div
                        key={index}
                        className="bg-white border-b border-primary dark:bg-secondary/50 text-center font-bold text-sm p-2 hidden sm:block"
                    >
                        {day}
                    </div>
                ))}
                {[...Array(35)].map((_, i) => (
                    <Skeleton key={i} className="h-16 bg-primary/15 sm:min-h-[120px] w-full " />
                ))}
            </div>
        </div>
    );
}
