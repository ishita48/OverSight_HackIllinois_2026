"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OnboardingExperience() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const totalSteps = 4;
  const progress = (currentStep / (totalSteps - 1)) * 100;

  // Pre-onboarding loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    console.log("handleNext called, currentStep:", currentStep);
    console.log("Button clicked successfully!");

    if (currentStep === totalSteps - 1) {
      // Complete onboarding and redirect to record page
      setIsTransitioning(true);
      try {
        console.log("Completing onboarding...");
        await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completedIntro: true,
          }),
        });
        // Redirect to record page with emotional momentum
        router.push("/home");
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
        router.push("/home");
      }
    } else {
      console.log("Moving to next step...");
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 30%, #fff5eb, #fae4d1, #f6c7a7)",
        }}
      >
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-[#db5c42] rounded-full animate-pulse opacity-80"></div>
              <div className="absolute inset-2 bg-[#e3654c] rounded-full animate-pulse delay-150"></div>
              <div className="absolute inset-4 bg-[#f6c7a7] rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
          <p className="text-slate-600 text-lg font-medium tracking-wide">
            Warming up the campfire...
          </p>
        </div>
      </div>
    );
  }

  // Step 0: Opening Quote Scene
  if (currentStep === 0) {
    return (
      <div
        className={`transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#000000] flex items-center justify-center relative overflow-hidden">
          {/* Enhanced ember background */}
          <div className="absolute z-0 inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#db5c42] rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#f6c7a7] rounded-full animate-pulse delay-150"></div>
            <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 bg-[#db5c42] rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-[#fae4d1] rounded-full animate-pulse delay-500"></div>
          </div>

          <div className="flex flex-col items-center space-y-8 max-w-2xl text-center mx-auto px-4 py-16">
            <blockquote className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-white leading-tight">
              "The most powerful person in the world is the storyteller."
            </blockquote>

            <cite className="text-lg text-slate-400 font-medium">
              — Steve Jobs
            </cite>

            <div className="space-y-2 pt-6">
              <p className="text-xl text-slate-300 max-w-[40ch]">
                You just built the campfire.
              </p>
              <p className="text-xl text-slate-300 max-w-[40ch]">
                Now let's light it together.
              </p>
            </div>

            <Button
              onClick={handleNext}
              disabled={isTransitioning}
              className="bg-[#db5c42] hover:bg-[#e3654c] z-10 transition-all duration-300 px-8 py-4 rounded-xl text-white font-semibold shadow-lg hover:scale-105 mt-8"
              size="lg"
            >
              {isTransitioning ? "Loading..." : "🔥 Step In"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: What OverSight Really Is
  if (currentStep === 1) {
    return (
      <div
        className={`transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 30%, #fff5eb, #fae4d1, #f6c7a7)",
          }}
        >
          {/* Soft ember texture */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-[#db5c42]/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-[#f6c7a7]/40 rounded-full blur-2xl animate-pulse delay-200"></div>
          </div>

          <div className="flex flex-col items-center space-y-8 max-w-xl text-center mx-auto px-4 py-16">
            <div className="space-y-2">
              <p className="text-lg text-slate-600 max-w-[42ch]">
                You've spent months building your product.
              </p>
              <p className="text-lg text-slate-600 max-w-[42ch]">
                Pitch decks, feature lists, LinkedIn bios…
              </p>
              <p className="text-lg text-slate-600 max-w-[42ch]">
                But when it's just you and the silence—
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#db5c42] leading-tight">
              Do you know what your story sounds like?
            </h1>

            <div className="space-y-2">
              <p className="text-sm text-slate-500 max-w-[40ch]">
                OverSight is not another app.
              </p>
              <p className="text-sm text-slate-500 max-w-[40ch]">
                It's a ritual.
              </p>
              <p className="text-sm text-slate-500 max-w-[40ch]">
                A voice-first space where your thoughts become narrative.
              </p>
            </div>

            <Button
              onClick={handleNext}
              disabled={isTransitioning}
              className="bg-[#db5c42] hover:bg-[#e3654c] z-10 transition-all duration-300 px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:scale-105"
            >
              {isTransitioning ? "Loading..." : "Next"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: No Scripts. No Filters. Just Truth.
  if (currentStep === 2) {
    return (
      <div
        className={`transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
          style={{
            background:
              "radial-gradient(130% 90% at 40% 20%, #fff5eb, #fae4d1, #f6c7a7, #e8b08a)",
          }}
        >
          {/* Enhanced ember texture */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-1/4 left-1/5 w-28 h-28 bg-[#db5c42]/50 rounded-full blur-2xl animate-pulse delay-100"></div>
            <div className="absolute bottom-1/3 right-1/6 w-20 h-20 bg-[#e8b08a]/40 rounded-full blur-xl animate-pulse delay-300"></div>
          </div>

          <div className="flex flex-col items-center space-y-8 max-w-lg text-center mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-800 leading-tight">
              No Scripts. No Filters. Just Truth.
            </h1>

            <div className="space-y-2">
              <p className="text-xl text-slate-700 max-w-[38ch] font-medium">
                You speak. We listen.
              </p>
              <p className="text-xl text-slate-700 max-w-[38ch] font-medium">
                Then we reflect back the story underneath your words.
              </p>
            </div>

            <div className="space-y-1 pt-4">
              <p className="text-sm text-slate-500 max-w-[35ch]">
                It's not a bio generator. It's a mirror.
              </p>
              <p className="text-sm text-slate-500 max-w-[35ch]">
                It doesn't judge. It just sees.
              </p>
            </div>

            <Button
              onClick={handleNext}
              disabled={isTransitioning}
              className="bg-[#db5c42] hover:bg-[#e3654c] z-10 transition-all duration-300 px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:scale-105 mt-6"
            >
              {isTransitioning ? "Loading..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Welcome to the Fire
  if (currentStep === 3) {
    return (
      <div
        className={`transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
          style={{
            background:
              "radial-gradient(140% 100% at 50% 10%, #fff5eb, #fae4d1, #f6c7a7, #e8b08a, #db5c42)",
          }}
        >
          {/* Dramatic fire glow */}
          <div className="absolute z-0 inset-0 opacity-25">
            <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#db5c42]/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-[#e8b08a]/50 rounded-full blur-2xl animate-pulse delay-150"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#f6c7a7]/60 rounded-full blur-xl animate-pulse delay-300"></div>
          </div>

          <div className="flex z-10 flex-col items-center space-y-8 max-w-md text-center mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-800 leading-tight">
              Welcome to the Campfire
            </h1>

            <div className="space-y-2 z-10">
              <p className="text-lg text-slate-700 max-w-[40ch]">
                This is not a product tour.
              </p>
              <p className="text-lg z-10 text-slate-700 max-w-[40ch]">
                This is a pause.
              </p>
              <p className="text-lg z-10 text-slate-700 max-w-[40ch]">
                A moment between building and becoming.
              </p>
            </div>

            <div className="space-y-1 z-10 pt-4">
              <p className="text-base text-slate-600 max-w-[38ch]">
                OverSight isn't here to help you pitch.
              </p>
              <p className="text-base text-[#db5c42] font-semibold max-w-[38ch]">
                It's here to help you remember why you started.
              </p>
            </div>

            <div className="pt-4 z-10">
              <p className="text-lg text-slate-700 font-medium mb-2">
                You ready?
              </p>
              <div className="text-2xl animate-bounce">🔥</div>
            </div>

            <Button
              onClick={handleNext}
              disabled={isTransitioning}
              className="bg-gradient-to-r z-10 from-[#db5c42] to-[#e8b08a] hover:from-[#e3654c] hover:to-[#eab48f] transition-all duration-300 px-8 py-4 rounded-xl text-white font-bold shadow-xl hover:scale-110 transform mt-6"
              size="lg"
            >
              {isTransitioning ? "🔥 Lighting..." : "🔥 Begin My First Story"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#2A2A2A]">
          Onboarding Complete!
        </h1>
      </div>
    </div>
  );
}
