import type { Metadata } from "next";
import { Montserrat as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "X-POST",
  description: "Schedule your social media posts with ease.",
  authors: {
    url: "https://x.com/Adarsh_Mamgain",
    name: "Adarsh Mamgain",
  },
  keywords: ["x-post", "social media", "schedule", "posts"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
