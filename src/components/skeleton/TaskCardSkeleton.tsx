import { Skeleton } from "@/components/ui/skeleton";

const TaskCardSkeleton = () => {
    return (
        <Skeleton className="flex w-full items-center gap-4 p-4 border rounded-lg h-24" />
    );
};

export default TaskCardSkeleton;
