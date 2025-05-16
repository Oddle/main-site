// src/app/api/geoip/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { geolocation } from '@vercel/functions'; // Import the helper

export async function GET(req: NextRequest) {
  // Use the geolocation helper provided by Vercel
  const { country } = geolocation(req); // Extracts country (e.g., 'SG', 'US')

  // Note: The helper returns undefined if the header isn't present (e.g., locally)

  if (country) {
    // Return the country code (already uppercase)
    return NextResponse.json({ country: country });
  } else {
    // Cannot determine country (running locally, header missing, etc.)
    return NextResponse.json({}); // Return empty object or handle as needed
  }
}

// Optional: Specify edge runtime for potentially faster cold starts
// export const runtime = 'edge';