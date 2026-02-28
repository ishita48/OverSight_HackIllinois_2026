"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Copy,
  CheckCircle,
  ExternalLink,
  Twitter,
  Linkedin,
  Facebook,
  Link,
  Eye,
  EyeOff,
  Settings,
  Globe,
  Lock,
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function PublicShareClient({ narrative }) {
  const [copiedItem, setCopiedItem] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [shareSettings, setShareSettings] = useState({
    showFounderInfo: true,
    showFullStory: true,
    showBreakthrough: true,
    showQuotes: true,
    allowComments: false,
  });

  const publicUrl = `${window.location.origin}/u/${narrative.founderName
    ?.toLowerCase()
    .replace(/\s+/g, "")}/${narrative.sessionId}`;

  const copyToClipboard = async (text, item) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      toast.success(`${item} copied to clipboard!`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const shareToSocial = (platform) => {
    const title = `${narrative.sessionTitle} - ${narrative.projectName}`;
    const text =
      narrative.feedbackJson.yourTruth ||
      "A founder's authentic journey and insights.";

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `${text}\n\n${title}`
        )}&url=${encodeURIComponent(publicUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          publicUrl
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          publicUrl
        )}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      {/* Header */}
      <div className="border-b border-[#2A2F4A] bg-[#0A0E27]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#E8E3D3]">
                Share Your Story
              </h1>
              <p className="text-[#8B9DC3] mt-1">
                Control how your founder journey appears to the world
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={isPublic ? "default" : "secondary"}
                className={`px-3 py-1 ${
                  isPublic
                    ? "bg-[#8B9DC3]/20 text-[#8B9DC3] border-[#8B9DC3]/30"
                    : "bg-[#6B6560]/20 text-[#6B6560] border-[#6B6560]/30"
                }`}
              >
                {isPublic ? (
                  <>
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Share Settings */}
          <div className="space-y-6">
            {/* Visibility Settings */}
            <Card className="bg-[#1A1F3A]/50 border-[#2A2F4A] backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#E8E3D3] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#8B9DC3]" />
                  Sharing Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Public/Private Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0E27]/50 border border-[#2A2F4A]">
                  <div>
                    <h3 className="text-[#E8E3D3] font-medium">
                      Make Story Public
                    </h3>
                    <p className="text-[#8B9DC3] text-sm mt-1">
                      Allow others to discover and share your founder story
                    </p>
                  </div>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                    className="data-[state=checked]:bg-[#8B9DC3]"
                  />
                </div>

                {/* Content Settings */}
                {isPublic && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <h4 className="text-[#E8E3D3] font-medium">
                      What to include:
                    </h4>

                    {Object.entries({
                      showFounderInfo: "Founder information",
                      showFullStory: "Complete story narrative",
                      showBreakthrough: "Breakthrough moments",
                      showQuotes: "Key quotes",
                      allowComments: "Allow reactions (coming soon)",
                    }).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <label className="text-[#8B9DC3] text-sm">
                          {label}
                        </label>
                        <Switch
                          checked={shareSettings[key]}
                          onCheckedChange={(checked) =>
                            setShareSettings((prev) => ({
                              ...prev,
                              [key]: checked,
                            }))
                          }
                          disabled={key === "allowComments"}
                          className="data-[state=checked]:bg-[#8B9DC3]"
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Share Links */}
            {isPublic && (
              <Card className="bg-[#1A1F3A]/50 border-[#2A2F4A] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#E8E3D3] flex items-center gap-2">
                    <Link className="w-5 h-5 text-[#8B9DC3]" />
                    Share Your Story
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Direct Link */}
                  <div className="space-y-2">
                    <label className="text-[#8B9DC3] text-sm font-medium">
                      Direct Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={publicUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-[#0A0E27]/50 border border-[#2A2F4A] rounded-lg text-[#E8E3D3] text-sm"
                      />
                      <Button
                        onClick={() => copyToClipboard(publicUrl, "Link")}
                        size="sm"
                        className="bg-[#8B9DC3]/20 hover:bg-[#8B9DC3]/30 text-[#8B9DC3] border-[#8B9DC3]/30"
                        variant="outline"
                      >
                        {copiedItem === "Link" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Social Sharing */}
                  <div className="space-y-3">
                    <label className="text-[#8B9DC3] text-sm font-medium">
                      Share on Social
                    </label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => shareToSocial("twitter")}
                        size="sm"
                        className="bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] border-[#1DA1F2]/30"
                        variant="outline"
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      <Button
                        onClick={() => shareToSocial("linkedin")}
                        size="sm"
                        className="bg-[#0077B5]/20 hover:bg-[#0077B5]/30 text-[#0077B5] border-[#0077B5]/30"
                        variant="outline"
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button
                        onClick={() => shareToSocial("facebook")}
                        size="sm"
                        className="bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] border-[#1877F2]/30"
                        variant="outline"
                      >
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                    </div>
                  </div>

                  {/* Preview Button */}
                  <Button
                    onClick={() => window.open(publicUrl, "_blank")}
                    className="w-full bg-gradient-to-r from-[#8B9DC3] to-[#DDB892] hover:from-[#8B9DC3]/80 hover:to-[#DDB892]/80 text-[#0A0E27] font-medium"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview Public Story
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Usage Tips */}
            <Card className="bg-[#1A1F3A]/30 border-[#2A2F4A]/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-[#E8E3D3] font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#DDB892]" />
                    Pro Tips
                  </h3>
                  <div className="space-y-3 text-sm text-[#8B9DC3]">
                    <p>• Share on LinkedIn to connect with other founders</p>
                    <p>
                      • Include in your email signature for authentic
                      credibility
                    </p>
                    <p>
                      • Use for investor meetings and pitch deck storytelling
                    </p>
                    <p>• Perfect for team onboarding and culture building</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Story Preview */}
          <div className="space-y-6">
            <Card className="bg-[#1A1F3A]/50 border-[#2A2F4A] backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#E8E3D3] flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#8B9DC3]" />
                  Story Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPublic ? (
                  <div className="space-y-6">
                    {/* Story Header */}
                    <div className="text-center space-y-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#8B9DC3] to-[#DDB892] flex items-center justify-center text-2xl font-bold text-[#0A0E27]"
                      >
                        {narrative.founderName?.charAt(0) || "F"}
                      </motion.div>
                      <div>
                        <h2 className="text-xl font-semibold text-[#E8E3D3]">
                          {narrative.founderName}
                        </h2>
                        <p className="text-[#8B9DC3] font-light">
                          {narrative.projectName}
                        </p>
                      </div>
                    </div>

                    {/* Story Content Preview */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-[#0A0E27]/30 border border-[#2A2F4A]">
                        <h3 className="text-[#DDB892] font-medium mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          {narrative.sessionTitle}
                        </h3>
                        <p className="text-[#8B9DC3] text-sm line-clamp-3">
                          {narrative.feedbackJson.yourStory?.substring(
                            0,
                            200
                          ) ||
                            narrative.feedbackJson.sessionReflection?.substring(
                              0,
                              200
                            ) ||
                            "A founder's authentic journey and insights..."}
                          {(narrative.feedbackJson.yourStory?.length > 200 ||
                            narrative.feedbackJson.sessionReflection?.length >
                              200) &&
                            "..."}
                        </p>
                      </div>

                      {/* Key Quote */}
                      {narrative.feedbackJson.keyQuotes?.[0]?.quote && (
                        <div className="p-4 rounded-lg bg-[#DDB892]/10 border border-[#DDB892]/20">
                          <blockquote className="text-[#DDB892] italic text-center">
                            "{narrative.feedbackJson.keyQuotes[0].quote}"
                          </blockquote>
                        </div>
                      )}

                      {/* Stats Preview */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-[#8B9DC3]/10">
                          <Heart className="w-5 h-5 mx-auto text-[#8B9DC3] mb-1" />
                          <p className="text-xs text-[#8B9DC3]">Inspiring</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#8B9DC3]/10">
                          <MessageCircle className="w-5 h-5 mx-auto text-[#8B9DC3] mb-1" />
                          <p className="text-xs text-[#8B9DC3]">Authentic</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#8B9DC3]/10">
                          <Users className="w-5 h-5 mx-auto text-[#8B9DC3] mb-1" />
                          <p className="text-xs text-[#8B9DC3]">Relatable</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <EyeOff className="w-12 h-12 mx-auto text-[#6B6560]" />
                    <div>
                      <h3 className="text-[#E8E3D3] font-medium">
                        Story is Private
                      </h3>
                      <p className="text-[#8B9DC3] text-sm mt-1">
                        Enable public sharing to preview how your story will
                        appear
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analytics Preview (Future Feature) */}
            <Card className="bg-[#1A1F3A]/30 border-[#2A2F4A]/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#8B9DC3]/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-[#8B9DC3]" />
                  </div>
                  <div>
                    <h3 className="text-[#E8E3D3] font-medium">
                      Story Analytics
                    </h3>
                    <p className="text-[#8B9DC3] text-sm mt-1">
                      Coming soon: See who's inspired by your journey
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 text-xs text-[#8B9DC3] mt-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Views
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Reactions
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Shares
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
