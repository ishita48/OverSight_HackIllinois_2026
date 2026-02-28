"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-[#F7F5F2] shadow-lg rounded-2xl">
              <CardContent className="p-8 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="w-16 h-16 mx-auto bg-[#D4735F]/10 rounded-full flex items-center justify-center"
                >
                  <AlertTriangle className="w-8 h-8 text-[#D4735F]" />
                </motion.div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-serif text-[#2C2825] font-light">
                    something went off-script
                  </h2>
                  <p className="text-[#6B6560] font-light leading-relaxed">
                    we encountered an unexpected moment in your story. let's get
                    back to the narrative.
                  </p>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-[#8B9DC3] hover:bg-[#7A8CB5] text-white rounded-xl transition-all duration-300"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    try again
                  </Button>

                  <Button
                    onClick={() => (window.location.href = "/home")}
                    variant="ghost"
                    className="text-[#6B6560] hover:text-[#D4735F] rounded-xl transition-colors duration-300"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    back to home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
