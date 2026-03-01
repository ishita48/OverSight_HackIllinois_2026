"use client";

import { useEffect, useState } from "react";

export default function MobileRedirect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      const isSmallScreen = window.innerWidth < 768;

      console.log("Mobile check:", {
        userAgent,
        isMobileDevice,
        isSmallScreen,
        windowWidth: window.innerWidth,
      });

      return isMobileDevice || isSmallScreen;
    };

    const shouldShowMobile = checkDevice();
    console.log("Should show mobile overlay:", shouldShowMobile);

    if (shouldShowMobile) {
      setIsMobile(true);
    }

    // Listen for window resize to catch orientation changes
    const handleResize = () => {
      const shouldShowMobileOnResize = checkDevice();
      console.log("Resize - should show mobile:", shouldShowMobileOnResize);
      if (shouldShowMobileOnResize) {
        setIsMobile(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("MobileRedirect render - isMobile:", isMobile);

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FAF8F4] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <h1 className="font-logo text-4xl font-bold text-[#D4735F] mb-2">
              OverSight
            </h1>
            <div className="w-20 h-1 bg-[#D4735F] mx-auto rounded-full"></div>
          </div>

          <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
            Desktop Experience Only
          </h2>

          <p className="text-neutral-600 mb-6 leading-relaxed">
            OverSight is currently optimized for desktop and web browsers to
            provide the best storytelling experience. Please visit us on your
            computer.
          </p>

          <div className="bg-white/50 rounded-lg p-4 border border-neutral-200">
            <p className="text-sm text-neutral-500 mb-2">
              <span className="font-medium">Coming Soon:</span>
            </p>
            <p className="text-sm text-neutral-600">
              Mobile support is in development and will be available soon!
            </p>
          </div>

          <div className="mt-8 text-xs text-neutral-400">
            For the best experience, visit on desktop or laptop
          </div>
        </div>
      </div>
    );
  }

  return null;
}
