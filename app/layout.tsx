import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { SidebarProvider } from "./context/SidebarContext";
import { AnalysisProvider } from "./context/AnalysisContext";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "next-themes";
import AnalysingIndicator from "./components/AnalysingIndicator";
import SmoothScroll from "./components/SmoothScroll";
import Script from "next/script";
import { Analytics } from "./analytics";
import ReferralTracker from "./components/ReferralTracker";

export const metadata: Metadata = {
metadataBase: new URL("https://trendsta.in"),

title: {
default: "Trendsta – AI Content Research",
template: "%s | Trendsta",
},

description:
"Trendsta is your AI-powered content research platform. Discover viral trends, generate script ideas, and grow your audience faster.",

openGraph: {
title: "Trendsta – AI Content Research",
description:
"Discover viral trends, generate script ideas, and grow your audience faster with AI.",
url: "https://trendsta.in",
siteName: "Trendsta",
type: "website",
locale: "en_US",
images: [
  {
    url: "/og", // generated route
    width: 1200,
    height: 630,
    alt: "Trendsta AI Social Growth Platform",
  },
],

},

twitter: {
card: "summary_large_image",
site: "@trendsta",
title: "Trendsta – AI Content Research",
description:
"Discover viral trends, generate script ideas, and grow your audience faster with AI.",
images: ["/og"],
}
};

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-body",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={`${plusJakartaSans.variable} ${instrumentSerif.variable} antialiased`}>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            <AnalysisProvider>
              <SidebarProvider>
                <SmoothScroll>
                  <AnalysingIndicator />
                  <Suspense fallback={null}>
                    <ReferralTracker />
                  </Suspense>
                  {children}
                </SmoothScroll>
              </SidebarProvider>
            </AnalysisProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

