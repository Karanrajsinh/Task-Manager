import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-none bg-primary/50",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-primary/5 transform -translate-x-full animate-skeleton"
      />
    </div>
  );
}

export { Skeleton };