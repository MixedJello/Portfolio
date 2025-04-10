import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navigation/TopNav/NavBar";

const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "Tyler McGue | Full-Stack Developer | Backend Engineer Portfolio",
  description: "Full-stack developer showcasing projects built with Next.js, TypeScript, and Go. Explore interactive features powered by GSAP and Matter.js, including animations and a dynamic contact form. Let’s connect for opportunities!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header id="HeaderZone">
          <Navbar />
        </header>
        <main className="pd-4">{children}</main>
      </body>
    </html>
  );
}
