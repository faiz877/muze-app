import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from './components/Providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Muze - Social Media Feed",
    template: "%s | Muze"
  },
  description: "A modern, responsive social media feed application built with Next.js, Apollo GraphQL, and Tailwind CSS",
  keywords: ["social media", "feed", "nextjs", "graphql", "tailwind", "typescript"],
  authors: [{ name: "Muze Team" }],
  creator: "Muze",
  publisher: "Muze",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://muze-app.vercel.app",
    title: "Muze - Social Media Feed",
    description: "A modern, responsive social media feed application",
    siteName: "Muze",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muze - Social Media Feed",
    description: "A modern, responsive social media feed application",
    creator: "@muze",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans min-h-screen`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
