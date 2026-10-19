import { Skeleton } from "@/components/ui/skeleton";

export interface RestaurantTableSkeletonProps {
  count?: number;
}

export function RestaurantTableSkeletonCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-card p-5 shadow-xs">
      {/* Top Header: Graphic + Status Badge */}
      <div className="flex items-start justify-between">
        {/* Table Graphic Placeholder */}
        <div className="p-1">
          <Skeleton className="h-[86px] w-[120px] rounded-xl bg-gray-200" />
        </div>

        {/* Status Badge Placeholder */}
        <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
      </div>

      {/* Bottom Footer Info */}
      <div className="mt-6 flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-14 bg-gray-200" />
          <Skeleton className="h-4 w-16 bg-gray-200" />
        </div>
        <Skeleton className="h-5 w-16 bg-gray-200" />
      </div>
    </div>
  );
}

export default function RestaurantTableSkeleton({ count = 12 }: RestaurantTableSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <RestaurantTableSkeletonCard key={index} />
      ))}
    </div>
  );
}
