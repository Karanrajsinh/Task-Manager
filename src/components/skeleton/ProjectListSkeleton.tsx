import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectListSkeleton() {
    return (
        <div className="container mx-auto p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Projects</h1>
                    <p className="text-muted-foreground">Manage your projects</p>
                </div>
                <Skeleton className="h-10 w-40 rounded-lg" />
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}
