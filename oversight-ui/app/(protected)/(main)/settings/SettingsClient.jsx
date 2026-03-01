"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Mic,
  Database,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Globe,
  Clock,
  Zap,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  Settings as SettingsIcon,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SettingsClient = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isDirty, setIsDirty] = useState(false);
  const [settings, setSettings] = useState({
    // Profile settings
    displayName: user?.firstName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    bio: "",
    timezone: "America/New_York",

    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    weeklyDigest: true,
    newFeatures: false,

    // Privacy settings
    profileVisibility: "private",
    sessionSharing: "private",
    analyticsOptOut: false,
    dataRetention: "2years",

    // Voice & Recording settings
    microphoneGain: [75],
    noiseReduction: true,
    autoTranscription: true,
    voiceTheme: "professional",
    recordingQuality: "high",

    // Interface settings
    theme: "light",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",

    // AI & Processing settings
    aiPersonality: "thoughtful",
    questionDepth: "moderate",
    followUpQuestions: true,
    contextAwareness: "high",
  });

  const tabs = [
    { id: "profile", label: "profile", icon: User },
    { id: "notifications", label: "notifications", icon: Bell },
    { id: "privacy", label: "privacy & security", icon: Shield },
    { id: "voice", label: "voice & recording", icon: Mic },
    { id: "interface", label: "interface", icon: Palette },
    { id: "ai", label: "AI preferences", icon: Zap },
    { id: "data", label: "data management", icon: Database },
  ];

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const checkUsernameAvailability = async (username) => {
    // Username is now automatically derived from email
    // No need for availability checking
    console.log(
      "Username availability check not needed - using email-based usernames"
    );
  };

  // Load current username on component mount
  const loadCurrentUsername = async () => {
    // Username is now automatically derived from email
    // No need to load from database
    console.log("Username loading not needed - using email-based usernames");
  };

  React.useEffect(() => {
    // No longer need to load username
  }, []);

  const handleSave = async () => {
    try {
      toast.success("Settings saved successfully!");
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };

  const handleExportData = () => {
    toast.info("Preparing your data export...");
    // Simulate data export
    setTimeout(() => {
      toast.success("Data export ready for download");
    }, 2000);
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is irreversible. Please contact support.");
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif font-light">
            personal information
          </CardTitle>
          <CardDescription>
            manage your profile details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">display name</Label>
            <Input
              id="displayName"
              value={settings.displayName}
              onChange={(e) =>
                handleSettingChange("displayName", e.target.value)
              }
              className="bg-white/60 border-[#F7F5F2] rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>
              public profile username
              <span className="text-xs text-[#6B6560] ml-2">
                (automatically generated from your email)
              </span>
            </Label>
            <div className="p-4 bg-[#F7F5F2]/50 border border-[#F7F5F2] rounded-xl">
              <p className="text-sm text-[#6B6560]">
                Your username is automatically generated from your email
                address. For example, if your email is{" "}
                <code className="text-xs bg-[#F7F5F2] px-1 py-0.5 rounded">
                  john@company.com
                </code>
                , your username will be{" "}
                <code className="text-xs bg-[#F7F5F2] px-1 py-0.5 rounded">
                  john
                </code>
                .
              </p>
              <p className="text-xs text-[#8B9DC3] mt-2">
                🔗 Your public profile:{" "}
                <code>/u/{settings.email?.split("@")[0] || "yourname"}</code>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">email address</Label>
            <Input
              id="email"
              value={settings.email}
              disabled
              className="bg-[#F7F5F2] border-[#F7F5F2] rounded-xl opacity-60"
            />
            <p className="text-xs text-[#6B6560]">
              email managed by your authentication provider
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">bio</Label>
            <Textarea
              id="bio"
              placeholder="tell us about your founder journey..."
              value={settings.bio}
              onChange={(e) => handleSettingChange("bio", e.target.value)}
              className="bg-white/60 border-[#F7F5F2] rounded-xl min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">timezone</Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) => handleSettingChange("timezone", value)}
            >
              <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">
                  Eastern Time (ET)
                </SelectItem>
                <SelectItem value="America/Chicago">
                  Central Time (CT)
                </SelectItem>
                <SelectItem value="America/Denver">
                  Mountain Time (MT)
                </SelectItem>
                <SelectItem value="America/Los_Angeles">
                  Pacific Time (PT)
                </SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif font-light">
            notification preferences
          </CardTitle>
          <CardDescription>
            choose how and when you want to hear from us
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              key: "emailNotifications",
              label: "email notifications",
              desc: "receive updates via email",
            },
            {
              key: "pushNotifications",
              label: "push notifications",
              desc: "browser and mobile alerts",
            },
            {
              key: "sessionReminders",
              label: "session reminders",
              desc: "gentle nudges to continue your story",
            },
            {
              key: "weeklyDigest",
              label: "weekly digest",
              desc: "summary of your storytelling progress",
            },
            {
              key: "newFeatures",
              label: "feature announcements",
              desc: "be first to know about new capabilities",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-[#F7F5F2]"
            >
              <div className="space-y-1">
                <Label className="text-[#2C2825] font-medium">
                  {item.label}
                </Label>
                <p className="text-sm text-[#6B6560] font-light">{item.desc}</p>
              </div>
              <Switch
                checked={settings[item.key]}
                onCheckedChange={(checked) =>
                  handleSettingChange(item.key, checked)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif font-light">
            privacy & security
          </CardTitle>
          <CardDescription>
            control your data and visibility preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>profile visibility</Label>
              <Select
                value={settings.profileVisibility}
                onValueChange={(value) =>
                  handleSettingChange("profileVisibility", value)
                }
              >
                <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    public - discoverable by others
                  </SelectItem>
                  <SelectItem value="private">
                    private - only you can see
                  </SelectItem>
                  <SelectItem value="contacts">
                    contacts only - visible to connections
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>session sharing</Label>
              <Select
                value={settings.sessionSharing}
                onValueChange={(value) =>
                  handleSettingChange("sessionSharing", value)
                }
              >
                <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    private - never shared
                  </SelectItem>
                  <SelectItem value="selective">
                    selective - choose per session
                  </SelectItem>
                  <SelectItem value="team">
                    team only - shared with collaborators
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>data retention</Label>
              <Select
                value={settings.dataRetention}
                onValueChange={(value) =>
                  handleSettingChange("dataRetention", value)
                }
              >
                <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1year">1 year</SelectItem>
                  <SelectItem value="2years">2 years</SelectItem>
                  <SelectItem value="5years">5 years</SelectItem>
                  <SelectItem value="forever">keep forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-[#F7F5F2]">
            <div className="space-y-1">
              <Label className="text-[#2C2825] font-medium">
                analytics opt-out
              </Label>
              <p className="text-sm text-[#6B6560] font-light">
                disable usage analytics and tracking
              </p>
            </div>
            <Switch
              checked={settings.analyticsOptOut}
              onCheckedChange={(checked) =>
                handleSettingChange("analyticsOptOut", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVoiceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif font-light">
            voice & recording
          </CardTitle>
          <CardDescription>
            optimize your audio experience and recording quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>microphone gain</Label>
              <div className="px-4">
                <Slider
                  value={settings.microphoneGain}
                  onValueChange={(value) =>
                    handleSettingChange("microphoneGain", value)
                  }
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[#6B6560] mt-1">
                  <span>quiet</span>
                  <span>{settings.microphoneGain[0]}%</span>
                  <span>loud</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>recording quality</Label>
              <Select
                value={settings.recordingQuality}
                onValueChange={(value) =>
                  handleSettingChange("recordingQuality", value)
                }
              >
                <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">standard - 16kHz</SelectItem>
                  <SelectItem value="high">high - 44kHz</SelectItem>
                  <SelectItem value="studio">studio - 96kHz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>voice theme</Label>
              <Select
                value={settings.voiceTheme}
                onValueChange={(value) =>
                  handleSettingChange("voiceTheme", value)
                }
              >
                <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">
                    professional - clear and direct
                  </SelectItem>
                  <SelectItem value="conversational">
                    conversational - warm and friendly
                  </SelectItem>
                  <SelectItem value="thoughtful">
                    thoughtful - gentle and reflective
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {[
            {
              key: "noiseReduction",
              label: "noise reduction",
              desc: "filter background noise automatically",
            },
            {
              key: "autoTranscription",
              label: "auto transcription",
              desc: "real-time speech-to-text conversion",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-[#F7F5F2]"
            >
              <div className="space-y-1">
                <Label className="text-[#2C2825] font-medium">
                  {item.label}
                </Label>
                <p className="text-sm text-[#6B6560] font-light">{item.desc}</p>
              </div>
              <Switch
                checked={settings[item.key]}
                onCheckedChange={(checked) =>
                  handleSettingChange(item.key, checked)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderInterfaceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif font-light">
            interface preferences
          </CardTitle>
          <CardDescription>customize your visual experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleSettingChange("theme", value)}
              >
                <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">light - bright and airy</SelectItem>
                  <SelectItem value="dark">dark - easy on the eyes</SelectItem>
                  <SelectItem value="auto">auto - follows system</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) =>
                  handleSettingChange("language", value)
                }
              >
                <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">english</SelectItem>
                  <SelectItem value="es">español</SelectItem>
                  <SelectItem value="fr">français</SelectItem>
                  <SelectItem value="de">deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>date format</Label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(value) =>
                    handleSettingChange("dateFormat", value)
                  }
                >
                  <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>time format</Label>
                <Select
                  value={settings.timeFormat}
                  onValueChange={(value) =>
                    handleSettingChange("timeFormat", value)
                  }
                >
                  <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 hour</SelectItem>
                    <SelectItem value="24h">24 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAITab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif font-light">
            AI conversation preferences
          </CardTitle>
          <CardDescription>
            customize how the AI interviewer interacts with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>AI personality</Label>
              <Select
                value={settings.aiPersonality}
                onValueChange={(value) =>
                  handleSettingChange("aiPersonality", value)
                }
              >
                <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">
                    professional - formal and structured
                  </SelectItem>
                  <SelectItem value="friendly">
                    friendly - warm and encouraging
                  </SelectItem>
                  <SelectItem value="thoughtful">
                    thoughtful - deep and reflective
                  </SelectItem>
                  <SelectItem value="direct">
                    direct - brief and to the point
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>question depth</Label>
              <Select
                value={settings.questionDepth}
                onValueChange={(value) =>
                  handleSettingChange("questionDepth", value)
                }
              >
                <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surface">
                    surface - quick and broad
                  </SelectItem>
                  <SelectItem value="moderate">
                    moderate - balanced exploration
                  </SelectItem>
                  <SelectItem value="deep">
                    deep - thorough investigation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>context awareness</Label>
              <Select
                value={settings.contextAwareness}
                onValueChange={(value) =>
                  handleSettingChange("contextAwareness", value)
                }
              >
                <SelectTrigger className="bg-white/60 border-[#F7F5F2] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    low - treat each session independently
                  </SelectItem>
                  <SelectItem value="medium">
                    medium - basic session continuity
                  </SelectItem>
                  <SelectItem value="high">
                    high - full narrative awareness
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-[#F7F5F2]">
            <div className="space-y-1">
              <Label className="text-[#2C2825] font-medium">
                follow-up questions
              </Label>
              <p className="text-sm text-[#6B6560] font-light">
                allow AI to ask clarifying questions
              </p>
            </div>
            <Switch
              checked={settings.followUpQuestions}
              onCheckedChange={(checked) =>
                handleSettingChange("followUpQuestions", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif font-light">
            data management
          </CardTitle>
          <CardDescription>
            control your data and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="p-6 h-auto flex flex-col items-start border-[#F7F5F2] hover:bg-[#F7F5F2]"
            >
              <div className="flex items-center gap-3 mb-2">
                <Download className="w-5 h-5 text-[#8B9DC3]" />
                <span className="font-medium">export data</span>
              </div>
              <p className="text-sm text-[#6B6560] font-light text-left">
                download all your sessions, transcripts, and insights
              </p>
            </Button>

            <Button
              onClick={handleDeleteAccount}
              variant="outline"
              className="p-6 h-auto flex flex-col items-start border-red-200 hover:bg-red-50 text-red-600"
            >
              <div className="flex items-center gap-3 mb-2">
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">delete account</span>
              </div>
              <p className="text-sm text-red-500 font-light text-left">
                permanently remove your account and all data
              </p>
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-[#2C2825]">storage usage</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6B6560]">audio recordings</span>
                <Badge variant="outline">2.3 GB</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6B6560]">transcripts</span>
                <Badge variant="outline">45 MB</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6B6560]">analysis data</span>
                <Badge variant="outline">12 MB</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-medium">
                <span className="text-[#2C2825]">total usage</span>
                <Badge>2.36 GB</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFCFB] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-serif font-light text-[#2C2825] tracking-tight">
            settings & preferences
          </h1>
          <p className="text-[#6B6560] font-light">
            customize your OverSight experience to match your storytelling style
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64"
          >
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                           transition-all duration-200 ${
                             activeTab === tab.id
                               ? "bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white shadow-lg"
                               : "text-[#6B6560] hover:bg-[#F7F5F2] hover:text-[#2C2825]"
                           }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  <ChevronRight
                    className={`w-4 h-4 ml-auto transition-transform ${
                      activeTab === tab.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "privacy" && renderPrivacyTab()}
            {activeTab === "voice" && renderVoiceTab()}
            {activeTab === "interface" && renderInterfaceTab()}
            {activeTab === "ai" && renderAITab()}
            {activeTab === "data" && renderDataTab()}
          </motion.div>
        </div>

        {/* Save Button */}
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#B85A47] hover:to-[#A04A37]
                       text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5 mr-2" />
              save changes
            </Button>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default SettingsClient;
