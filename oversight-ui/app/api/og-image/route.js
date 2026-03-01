// app/api/og-image/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "OverSight User";

  // Simple SVG-based OG image
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gradient -->
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FDFCFB;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#FAF9F7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F7F5F2;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#D4735F;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#8B9DC3;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#DDB892;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Decorative elements -->
      <circle cx="100" cy="100" r="80" fill="#D4735F" opacity="0.1"/>
      <circle cx="1100" cy="530" r="100" fill="#8B9DC3" opacity="0.1"/>
      <circle cx="1000" cy="150" r="60" fill="#DDB892" opacity="0.15"/>
      
      <!-- Top accent bar -->
      <rect width="1200" height="8" fill="url(#accent)"/>
      
      <!-- OverSight logo area -->
      <rect x="80" y="80" width="60" height="60" rx="15" fill="url(#accent)"/>
      <text x="160" y="125" font-family="Georgia, serif" font-size="28" font-weight="300" fill="#2C2825">OverSight</text>
      
      <!-- Main content -->
      <text x="600" y="280" font-family="Georgia, serif" font-size="48" font-weight="400" fill="#2C2825" text-anchor="middle">${name}</text>
      <text x="600" y="340" font-family="system-ui, sans-serif" font-size="24" font-weight="500" fill="#D4735F" text-anchor="middle">Founder Journey</text>
      
      <!-- Description -->
      <text x="600" y="420" font-family="system-ui, sans-serif" font-size="20" font-weight="300" fill="#6B6560" text-anchor="middle">Explore their story, insights, and entrepreneurial journey</text>
      
      <!-- Bottom branding -->
      <text x="600" y="550" font-family="system-ui, sans-serif" font-size="18" font-weight="300" fill="#6B6560" text-anchor="middle">OverSight.app</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
