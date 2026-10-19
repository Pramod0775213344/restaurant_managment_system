import { Skeleton } from "@/components/ui/skeleton";

export interface MenuItemSkeletonProps {
  count?: number;
}

export function MenuItemSkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-card shadow-xs">
      {/* Image Skeleton */}
      <div className="relative h-44 w-full bg-gray-100/80 overflow-hidden">
        <Skeleton className="h-full w-full rounded-none bg-gray-200" />
        {/* Badge Skeleton */}
        <div className="absolute right-2.5 top-2.5">
          <Skeleton className="h-5 w-20 rounded-full bg-gray-300/80" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4.5 w-3/4 bg-gray-200" />
            <Skeleton className="h-3 w-20 bg-gray-200" />
          </div>
          <Skeleton className="h-5 w-16 bg-gray-200 shrink-0" />
        </div>

        {/* Description Lines */}
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3 w-full bg-gray-200" />
          <Skeleton className="h-3 w-4/5 bg-gray-200" />
        </div>

        {/* Prep Time Footer */}
        <div className="mt-auto pt-2 flex items-center gap-1.5">
          <Skeleton className="h-3 w-3 rounded-full bg-gray-200" />
          <Skeleton className="h-3 w-20 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function MenuItemSkeleton({ count = 10 }: MenuItemSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <MenuItemSkeletonCard key={index} />
      ))}
    </div>
  );
}
