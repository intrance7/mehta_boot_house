export default function SkeletonCard() {
  return (
    <div className="group rounded-3xl bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-0 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-zinc-800/30 w-full" />
      
      {/* Content Skeleton */}
      <div className="space-y-3 p-4">
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-4">
          <div className="h-4 bg-zinc-800/50 rounded-md w-3/4"></div>
          <div className="h-4 bg-zinc-800/50 rounded-md w-1/4"></div>
        </div>
        
        {/* Subtitle */}
        <div className="h-3 bg-zinc-800/50 rounded-md w-1/2"></div>
        
        {/* Actions row */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-4 h-4 rounded-full bg-zinc-800/50"></div>
            <div className="w-4 h-4 rounded-full bg-zinc-800/50"></div>
          </div>
          <div className="h-8 w-20 bg-zinc-800/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
