import { motion } from "framer-motion";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ${className}`} />
);

export const TableRowSkeleton = ({ cols = 4 }: { cols?: number }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-4 py-8 px-8 border-b border-zinc-100 dark:border-zinc-800"
  >
    {Array.from({ length: cols }).map((_, i) => (
      <Skeleton key={i} className={`h-6 ${i === 0 ? "w-1/3" : "flex-1"}`} />
    ))}
  </motion.div>
);

export const CardSkeleton = () => (
  <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl space-y-4">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-10 w-48" />
    <Skeleton className="h-4 w-full" />
  </div>
);

export const MetricSkeleton = () => (
  <div className="rounded-[2rem] p-6 bg-zinc-800/50 space-y-3">
    <Skeleton className="h-3 w-16 opacity-20" />
    <Skeleton className="h-8 w-24" />
    <Skeleton className="h-3 w-32 opacity-10" />
  </div>
);
