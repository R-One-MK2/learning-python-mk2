import type { Metadata } from "next";
import { Roboto_Mono, Merriweather, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const serif = Merriweather({
  variable: "--font-serif",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

const mono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Dimension A - AI Governance Framework",
  description:
    "Singapore's Model AI Governance Framework. Stress-test your LLM against all AI Verify principles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "scroll-smooth",
        serif.variable,
        mono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
