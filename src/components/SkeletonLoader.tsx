const SkeletonLoader = () => {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="flex flex-col gap-4">
        {/* Icon skeleton */}
        <div className="w-16 h-16 rounded-xl bg-secondary/50" />
        
        {/* Content skeleton */}
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-secondary/50" />
          <div className="h-4 w-1/2 rounded bg-secondary/50" />
        </div>
        
        {/* Progress skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-20 rounded bg-secondary/50" />
            <div className="h-3 w-12 rounded bg-secondary/50" />
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-secondary/50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SubjectCardSkeleton = () => {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6 animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-secondary/50" />
          <div className="w-16 h-6 rounded-full bg-secondary/50" />
        </div>
        
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-secondary/50" />
          <div className="h-4 w-1/2 rounded bg-secondary/50" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-16 rounded bg-secondary/50" />
            <div className="h-3 w-10 rounded bg-secondary/50" />
          </div>
          <div className="h-2 bg-secondary rounded-full">
            <div className="h-full w-1/2 bg-secondary/50 rounded-full" />
          </div>
        </div>
        
        <div className="h-3 w-24 rounded bg-secondary/50" />
      </div>
    </div>
  );
};

export default SkeletonLoader;

