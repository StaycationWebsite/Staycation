import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UIProviders from "@/Components/UIProviders";
import Navbar from "../Components/Navbar";
import { Proviers } from '@/Components/Providers'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Staycation Haven",
  description: "Staycation Haven booking and admin portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <UIProviders>
          <Proviers>
            <Navbar />
            {children}
          </Proviers>
        </UIProviders>
      </body>
    </html>
  );
}
