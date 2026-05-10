import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://regexlab.dev"),
  title: "RegexLab - Professional Regex Testing Tool",
  description:
    "A fully client-side, browser-based Regular Expression testing and learning tool built for professional software developers.",
  icons: {
    icon: "/regex-lab-logo.ico",
  },
  openGraph: {
    title: "RegexLab - Professional Regex Testing Tool",
    description:
      "A fully client-side, browser-based Regular Expression testing and learning tool built for professional software developers.",
    url: "https://regexlab.dev",
    siteName: "RegexLab",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/204_1x_shots_so.png",
        width: 1200,
        height: 630,
        alt: "RegexLab - Regex Testing Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RegexLab - Professional Regex Testing Tool",
    description:
      "A fully client-side, browser-based Regular Expression testing and learning tool built for professional software developers.",
    images: ["/204_1x_shots_so.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}