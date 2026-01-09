"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import HelpSidebar from "./HelpSidebar";
import Footer from "./Footer";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [isHelpSidebarOpen, setIsHelpSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Sidebar Toggle */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/haven_logo.png"
                alt="Staycation Haven Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-2xl font-display text-brand-primary">Staycation Haven</span>
            </Link>
            <button
              onClick={() => setIsHelpSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {children}

      <Footer />

      {/* Help Sidebar */}
      <HelpSidebar
        isOpen={isHelpSidebarOpen}
        onClose={() => setIsHelpSidebarOpen(false)}
      />
    </div>
  );
};

export default SidebarLayout;
