import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navigation/TopNav/NavBar";

const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "Tyler McGue",
  description: "Insert Job Here",
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
