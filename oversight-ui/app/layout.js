import { Inter } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import { Outfit } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import MobileRedirect from "@/components/MobileRedirect";

// Display font for page titles and section headers (Clash Display alternative)
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Elegant serif font for the BackStory logo
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
});

// UI/Body text font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

// Monospace font for system text, tags, metadata
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.backstory.space/"), // Update with your actual domain
  title: {
    default: "BackStory - Your Founder Story Platform",
    template: "%s | BackStory",
  },
  description:
    "Transform your scattered thoughts into compelling founder narratives through voice-powered storytelling. Discover your authentic story with AI-powered insights.",
  keywords: [
    "founder story",
    "startup narrative",
    "voice journaling",
    "founder journey",
    "storytelling platform",
    "entrepreneur story",
    "founder narrative",
    "startup story",
    "voice-to-text",
    "AI storytelling",
    "founder insights",
    "narrative discovery",
    "business storytelling",
    "pitch deck narrative",
    "investor storytelling",
  ],
  authors: [{ name: "Amit Jadhav", url: "https://www.backstory.space/" }],
  creator: "Amit Jadhav",
  publisher: "BackStory",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  applicationName: "BackStory",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
    other: [
      {
        rel: "icon",
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
  },

  other: {
    "theme-color": "#D4735F",
    "color-scheme": "light",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "BackStory",
    "application-name": "BackStory",
    "msapplication-TileColor": "#D4735F",
    "msapplication-config": "/browserconfig.xml",
    "mobile-web-app-capable": "yes",
    "apple-touch-fullscreen": "yes",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/callback"
      afterSignUpUrl="/callback"
    >
      <Analytics />
      <html
        lang="en"
        className={`${outfit.variable} ${inter.variable} ${ibmPlexMono.variable} ${playfairDisplay.variable}`}
      >
        <body className="font-ui bg-[#FAF8F4] text-neutral-900 antialiased">
          <MobileRedirect />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
