import { cn } from "@/lib/utils";

export default function Loading({ className }: { className?: string }) {
  return (
    <div className={cn(className, "flex justify-center items-center")} aria-label="読み込み中">
      <div className="animate-ping h-2 w-2 bg-violet-600 rounded-full"></div>
      <div className="animate-ping h-2 w-2 bg-violet-600 rounded-full mx-4"></div>
      <div className="animate-ping h-2 w-2 bg-violet-600 rounded-full"></div>
    </div>
  );
}
