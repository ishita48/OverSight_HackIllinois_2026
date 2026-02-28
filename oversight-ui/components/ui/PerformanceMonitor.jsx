"use client";

import { useEffect } from "react";

export const PerformanceMonitor = ({ pageName }) => {
  useEffect(() => {
    // Only in development mode
    if (process.env.NODE_ENV === "development") {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            console.log(
              `${pageName} - Page Load Time:`,
              entry.loadEventEnd - entry.loadEventStart,
              "ms"
            );
            console.log(
              `${pageName} - DOM Content Loaded:`,
              entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              "ms"
            );
          }
        }
      });

      observer.observe({ entryTypes: ["navigation"] });

      return () => observer.disconnect();
    }
  }, [pageName]);

  return null;
};

export const preloadRoute = (route) => {
  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = route;
    document.head.appendChild(link);
  }
};

export default PerformanceMonitor;
