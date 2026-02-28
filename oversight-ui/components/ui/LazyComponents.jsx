import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for client components
const LoadingFallback = ({ className = "h-64 w-full rounded-2xl" }) => (
  <div className={`animate-pulse bg-[#F7F5F2] ${className}`} />
);

// Lazy load heavy components
export const LazyProjectsClient = dynamic(
  () => import("@/app/(protected)/(main)/projects/ProjectsClient"),
  {
    ssr: false,
    loading: () => (
      <main className="min-h-screen bg-[#FDFCFB] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/4 bg-[#F7F5F2]" />
            <Skeleton className="h-4 w-1/3 bg-[#F7F5F2]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingFallback key={i} />
            ))}
          </div>
        </div>
      </main>
    ),
  }
);

export const LazySettingsClient = dynamic(
  () => import("@/app/(protected)/(main)/settings/SettingsClient"),
  {
    ssr: false,
    loading: () => (
      <main className="min-h-screen bg-[#FDFCFB] p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-1/3 bg-[#F7F5F2]" />
            <Skeleton className="h-4 w-1/2 bg-[#F7F5F2]" />
          </div>
          <div className="flex gap-8">
            <div className="w-64 space-y-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-[#F7F5F2]" />
              ))}
            </div>
            <div className="flex-1">
              <LoadingFallback className="h-96" />
            </div>
          </div>
        </div>
      </main>
    ),
  }
);

export const LazySessionsClient = dynamic(
  () => import("@/app/(protected)/(main)/sessions/SessionsClient"),
  {
    ssr: false,
    loading: () => (
      <main className="min-h-screen bg-[#FDFCFB] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/4 bg-[#F7F5F2]" />
            <Skeleton className="h-4 w-1/3 bg-[#F7F5F2]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <LoadingFallback key={i} />
            ))}
          </div>
        </div>
      </main>
    ),
  }
);

export const LazyHomeClient = dynamic(
  () => import("@/app/(protected)/(main)/home/HomeClient"),
  {
    ssr: false,
    loading: () => (
      <main className="min-h-screen bg-[#FDFCFB] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3 bg-[#F7F5F2]" />
            <Skeleton className="h-4 w-1/2 bg-[#F7F5F2]" />
          </div>

          <LoadingFallback className="h-32" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 bg-[#F7F5F2] rounded-2xl" />
            ))}
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4 bg-[#F7F5F2]" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <LoadingFallback key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    ),
  }
);

export default LoadingFallback;
