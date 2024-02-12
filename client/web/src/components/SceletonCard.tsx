import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn(className, "flex flex-col max-w-[500px] min-w-[250px]")}>
      <Skeleton className="h-[350px] w-[90%] rounded-xl p-4 m-4" />
    </div>
  );
}
