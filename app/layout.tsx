import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";
import AnimatedBackground from "@/components/AnimatedBackground";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CLEARED",
  description: "Personal platinum trophy journey log",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <AnimatedBackground />
          <Navbar />
          <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8" style={{ position: "relative", zIndex: 1 }}>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
