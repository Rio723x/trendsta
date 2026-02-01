import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "./context/SidebarContext";
import { AnalysisProvider } from "./context/AnalysisContext";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "./context/ThemeContext";
import AnalysingIndicator from "./components/AnalysingIndicator";
import SmoothScroll from "./components/SmoothScroll";

export const metadata: Metadata = {
  title: "Trendsta - Content Research Tool",
  description: "Your daily content strategy dashboard for viral content creation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <QueryProvider>
            <AnalysisProvider>
              <SidebarProvider>
                <SmoothScroll>
                  <AnalysingIndicator />
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

