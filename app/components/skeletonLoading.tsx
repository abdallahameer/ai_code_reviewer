"use client";

export default function SkeletonLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-linear-to-b from-gray-50 to-gray-100 rounded-2xl shadow-xl p-10 flex flex-col items-center text-center gap-6">
        {/* Title Skeleton */}
        <div className="h-10 w-48 bg-gray-300 rounded-lg animate-pulse"></div>

        {/* Paragraph Skeleton */}
        <div className="w-full space-y-2">
          <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
          <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full h-12 bg-gray-300 rounded-xl animate-pulse"></div>

        {/* Disclaimer Skeleton */}
        <div className="h-3 w-2/3 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
