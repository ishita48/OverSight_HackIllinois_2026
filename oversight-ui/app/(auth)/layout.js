export const metadata = {
  title: {
    template: "%s | OverSight",
    default: "OverSight - Your Founder Story Platform",
  },
  description:
    "Join OverSight to craft your authentic founder narrative through voice. Trusted by 500+ founders worldwide.",
  keywords:
    "founder story, startup narrative, authentication, voice journaling, founder platform",
  openGraph: {
    title: "OverSight - Your Founder Story Platform",
    description:
      "Join OverSight to craft your authentic founder narrative through voice.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OverSight - Your story deserves to be told",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OverSight - Your Founder Story Platform",
    description:
      "Join OverSight to craft your authentic founder narrative through voice.",
    images: ["/og-image.png"],
  },
};

export default function AuthLayout({ children }) {
  return children;
}
