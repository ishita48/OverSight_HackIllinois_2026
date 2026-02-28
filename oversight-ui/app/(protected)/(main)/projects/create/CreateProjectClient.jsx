"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stages = [
  {
    value: "idea",
    label: "Idea",
    description: "Early conceptualization phase",
  },
  {
    value: "validating",
    label: "Validating",
    description: "Testing market fit and assumptions",
  },
  {
    value: "building",
    label: "Building",
    description: "Developing the product or service",
  },
  {
    value: "launched",
    label: "Launched",
    description: "Live and serving customers",
  },
  { value: "growing", label: "Growing", description: "Scaling and expanding" },
  {
    value: "pivoting",
    label: "Pivoting",
    description: "Changing direction or strategy",
  },
];

export default function CreateProjectClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stage: "idea",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Project name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = await response.json();

      // Redirect to the projects page
      router.push("/projects");
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/projects">
            <Button
              variant="ghost"
              className="mb-6 text-[#6B6560] hover:text-[#2C2825] hover:bg-[#F7F5F2]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              back to projects
            </Button>
          </Link>

          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-[#D4735F]/10 to-[#D4735F]/20 rounded-2xl 
                         flex items-center justify-center mx-auto"
            >
              <Sparkles className="w-8 h-8 text-[#D4735F]" />
            </motion.div>

            <h1 className="text-3xl font-serif font-light text-[#2C2825]">
              create new project
            </h1>
            <p className="text-[#6B6560] font-light leading-relaxed max-w-md mx-auto">
              start a new storytelling journey and begin capturing the essence
              of your founder experience
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/60 backdrop-blur border-[#F7F5F2] shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-[#2C2825]">
                project details
              </CardTitle>
              <CardDescription className="text-[#6B6560] font-light">
                give your project a name and context to get started
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#2C2825] font-medium">
                    project name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., founder's journey, product evolution..."
                    className="bg-[#F7F5F2] border-[#E5E5E0] focus:border-[#D4735F] font-light"
                    disabled={isLoading}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-[#2C2825] font-medium"
                  >
                    description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="what story do you want to tell? what themes will you explore?"
                    className="bg-[#F7F5F2] border-[#E5E5E0] focus:border-[#D4735F] font-light resize-none"
                    rows={4}
                    disabled={isLoading}
                  />
                </div>

                {/* Current Stage */}
                <div className="space-y-2">
                  <Label htmlFor="stage" className="text-[#2C2825] font-medium">
                    current stage
                  </Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => handleInputChange("stage", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-[#F7F5F2] border-[#E5E5E0] focus:border-[#D4735F]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{stage.label}</span>
                            <span className="text-sm text-[#6B6560]">
                              {stage.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm font-light bg-red-50 p-3 rounded-lg border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Link href="/projects" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-[#E5E5E0] text-[#6B6560] hover:bg-[#F7F5F2] 
                               hover:text-[#2C2825] rounded-xl font-medium"
                      disabled={isLoading}
                    >
                      cancel
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    disabled={isLoading || !formData.name.trim()}
                    className="flex-1 bg-gradient-to-r from-[#D4735F] to-[#B85A47] 
                             hover:from-[#B85A47] hover:to-[#A04A37] text-white rounded-xl
                             font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        creating...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        create project
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Helper Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-[#8B9DC3] font-light">
            💡 tip: you can always edit these details later as your story
            evolves
          </p>
        </motion.div>
      </div>
    </main>
  );
}
