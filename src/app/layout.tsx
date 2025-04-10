import type { Metadata } from 'next';
import { URL } from 'url'; // Import URL

// Read the base URL from environment variables
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
  : new URL('http://localhost:3000'); // Fallback for local dev if var is not set

export const metadata: Metadata = {
  metadataBase: baseUrl, // Use the determined base URL
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
