import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import "./globals.css";

// Load Google Fonts (Geist & Geist Mono)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Advanced SEO Metadata Configuration
 * Defines search engine optimization tags, open graph properties, and PWA manifest links.
 */
export const metadata: Metadata = {
  title: {
    default: "LendLoop - Neighborhood Tool Lending & Sharing Platform",
    template: "%s | LendLoop",
  },
  description:
    "Borrow what you need. Lend what you don’t. A trusted P2P platform for sharing and borrowing household tools and equipment around your neighborhood.",
  keywords: [
    "tool lending",
    "borrow tools",
    "neighborhood sharing",
    "equipment rental",
    "LendLoop",
    "community sharing platform",
  ],
  authors: [{ name: "Rohmat Sidiq Mustaqim" }],
  creator: "Rohmat Sidiq Mustaqim",
  publisher: "LendLoop",
  metadataBase: new URL("https://lendloop-rohmat.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://lendloop-rohmat.vercel.app",
    title: "LendLoop - Neighborhood Tool Lending",
    description:
      "Borrow what you need. Lend what you don’t. Share and borrow equipment safely in your local community.",
    siteName: "LendLoop",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LendLoop Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LendLoop - Neighborhood Tool Lending",
    description: "Borrow what you need. Lend what you don’t.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LendLoop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Viewport configuration for responsive design and PWA theme styling.
 */
export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

/**
 * RootLayout Component
 * Wraps the entire application with ClerkProvider for authentication,
 * ConvexClientProvider for real-time backend synchronization, and applies global SEO setups.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="id">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
