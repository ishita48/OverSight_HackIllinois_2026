"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Flame, Sparkles, ArrowLeft, Mic, Brain, Book } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const features = [
    {
      icon: <Mic className="w-5 h-5" />,
      title: "Voice your truth",
      description: "Just start talking. No prep needed.",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI finds patterns",
      description: "Discovers your unique founder DNA.",
    },
    {
      icon: <Book className="w-5 h-5" />,
      title: "Your story emerges",
      description: "Ready for investors and customers.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F2] via-transparent to-[#F7F5F2] opacity-60" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#E4B08F]/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#8B9DC3]/6 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-gradient-to-br from-[#D4735F]/4 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <ArrowLeft className="w-5 h-5 text-[#6B6560] group-hover:text-[#2C2825] transition-colors" />
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4735F] to-[#B85A47] flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-logo text-[#2C2825]">
                BackStory
              </span>
            </div>
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Welcome Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-serif font-light text-[#2C2825] leading-tight">
                Your story
                <br />
                <span className="bg-gradient-to-r from-[#D4735F] via-[#E4B08F] to-[#8B9DC3] bg-clip-text text-transparent">
                  starts here
                </span>
              </h1>

              <p className="text-xl text-[#6B6560] leading-relaxed max-w-lg">
                Discover your authentic founder narrative through voice-powered
                storytelling.
              </p>
            </div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm border border-[#E4B08F]/20 rounded-xl p-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#D4735F] to-[#B85A47] flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif font-medium text-[#2C2825] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#6B6560]">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Getting Started */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-gradient-to-r from-[#D4735F]/10 to-[#8B9DC3]/10 border border-[#E4B08F]/20 rounded-2xl p-6"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="w-5 h-5 text-[#D4735F]" />
                <span className="font-serif font-medium text-[#2C2825]">
                  Ready to begin?
                </span>
              </div>
              <p className="text-[#6B6560] leading-relaxed">
                Create your account and start your first voice session in under
                2 minutes. Your founder story is waiting to be discovered.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side - Sign Up Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md">
              <div className="bg-white/80 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-serif font-medium text-[#2C2825] mb-2">
                    Create your story
                  </h2>
                  <p className="text-[#6B6560]">
                    Start your founder narrative journey
                  </p>
                </div>

                <SignUp
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#C66A56] hover:to-[#A5533F] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300",
                      formButtonSecondary:
                        "border-[#E4B08F]/30 text-[#6B6560] hover:bg-[#F7F5F2] transition-all duration-300",
                      socialButtonsBlockButton:
                        "border-[#E4B08F]/30 text-[#6B6560] hover:bg-[#F7F5F2] transition-all duration-300",
                      footerActionLink:
                        "text-[#D4735F] hover:text-[#B85A47] transition-colors duration-300",
                      card: "shadow-none bg-transparent border-0",
                      headerTitle: "text-[#2C2825] font-serif",
                      headerSubtitle: "text-[#6B6560]",
                      socialButtonsBlockButtonText:
                        "text-[#6B6560] font-medium",
                      dividerText: "text-[#8B9DC3]",
                      formFieldLabel: "text-[#2C2825] font-medium",
                      formFieldInput:
                        "border-[#E4B08F]/30 focus:border-[#D4735F] focus:ring-[#D4735F]/20 bg-white/80 backdrop-blur-sm",
                      footerActionText: "text-[#6B6560]",
                      identityPreviewText: "text-[#6B6560]",
                      identityPreviewEditButton:
                        "text-[#D4735F] hover:text-[#B85A47]",
                      formFieldSuccessText: "text-[#8B9DC3]",
                      formFieldErrorText: "text-[#B85A47]",
                      formFieldWarningText: "text-[#E4B08F]",
                    },
                    layout: {
                      socialButtonsPlacement: "top",
                      showOptionalFields: false,
                    },
                  }}
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  forceRedirectUrl="/callback"
                />
              </div>

              {/* Additional Help */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center mt-6"
              >
                <p className="text-sm text-[#8B9DC3]">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-[#D4735F] hover:text-[#B85A47] font-medium transition-colors duration-300"
                  >
                    Sign in to continue
                  </Link>
                </p>
              </motion.div>

              {/* Privacy Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-center mt-4"
              >
                <p className="text-xs text-[#8B9DC3] leading-relaxed">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy. Your stories are encrypted and secure.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
