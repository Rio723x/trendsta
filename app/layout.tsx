import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "./context/SidebarContext";
import { QueryProvider } from "./providers/QueryProvider";

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
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
