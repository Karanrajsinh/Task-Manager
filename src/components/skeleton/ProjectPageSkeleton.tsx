import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectPageSkeleton() {
    return (
        <div className="container mx-auto p-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 lg:flex-row justify-between lg:items-center mb-8">
                <div>
                    <Skeleton className="h-8 w-64 mb-2 rounded-sm" />
                    <Skeleton className="h-5 w-80 mb-4 rounded-sm" />
                    <Skeleton className="h-6 w-32 rounded-lg" />
                </div>
                <div className="flex justify-end w-full lg:w-fit gap-4">
                    <Skeleton className="h-10 w-10 rounded-sm" />
                    <Skeleton className="h-10 w-10 rounded-sm" />
                </div>
            </div>

            {/* Tasks Header */}
            <div className="grid grid-cols-2 border-b pb-4 mb-8 gap-4">
                <h2 className="text-xl font-semibold">Tasks</h2>
                <div className="flex gap-2 justify-end w-full sm:w-auto">
                    <Skeleton className="h-10  w-32 rounded-sm" />
                    <Skeleton className="h-10 w-fit  sm:w-32 rounded-sm" />
                </div>
            </div>

            {/* Task List Skeleton */}
            <div className="space-y-3 max-h-[600px] flex flex-col gap-4 overflow-y-auto pr-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 lg:h-28 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}