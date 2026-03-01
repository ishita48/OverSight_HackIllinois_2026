export const metadata = {
  title: {
    template: "%s | OverSight",
    default: "OverSight",
  },
  description:
    "Join OverSight to save 100s of dollars, that you should have alwayssaved.",
  keywords:
    "founder story, startup narrative, authentication, voice journaling, founder platform",
  openGraph: {
    title: "OverSight",
    description:
      "Join OverSight to craft your authentic founder narrative through voice.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OverSight ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OverSight",
    description:
      "Join OverSight to save 100s of dollars, that you should have alwayssaved.",
    images: ["/og-image.png"],
  },
};

export default function AuthLayout({ children }) {
  return children;
}
