"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  Calendar,
  Heart,
} from "lucide-react";
import { useTheme } from "next-themes";

interface User {
  name?: string;
  email?: string;
  image?: string;
  profile_image_url?: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const profileRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = ["Havens", "Contacts", "Location", "About"];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // Hide navbar on certain pages
  const shouldHideNavbar = pathname === "/login" || 
                           pathname === "/admin/login" || 
                           pathname === "/admin/owners" || 
                           pathname === "/admin/csr";

  if (!mounted || shouldHideNavbar) return null;

  return (
    <nav className="fixed w-full h-16 px-6 bg-white dark:bg-gray-900 border-b border-brand-primary/20 dark:border-brand-primary/30 z-50">
      <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo with animation */}
        <Link href={"/"}>
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="/haven_logo.png"
              alt="Staycation Haven Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-brand-primary">Staycation</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item, idx) => {
            let href = "/";
            if (item === "Contacts") href = "/contacts";
            else if (item === "Location") href = "/location";
            else if (item === "Login") href = "/login";
            else if (item === "Havens") href = "/rooms";
            else if (item === "About") href = "/about";

            const isActive = pathname === href;

            return (
              <Link key={idx} href={href}>
                <div className="cursor-pointer">
                  <span
                    className={`${
                      isActive
                        ? "text-brand-primary dark:text-brand-primaryLight font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primaryLight"
                    } font-medium`}
                  >
                    {item}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-orange-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          )}

          {/* CTA Button / User Profile */}
          {status === "loading" ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          ) : session?.user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border-2 border-orange-200 transition-all duration-300 transform hover:scale-105"
              >
                {(session.user as User).profile_image_url ||
                (session.user as User).image ? (
                  <img
                    src={(session.user as User).profile_image_url ||
                    (session.user as User).image}
                    alt={(session.user as User).name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="font-semibold text-gray-800 max-w-32 truncate">
                  {(session.user as User).name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-slide-down">
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-700 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {(session.user as User).profile_image_url ||
                      (session.user as User).image ? (
                        <img
                          src={(session.user as User).profile_image_url ||
                          (session.user as User).image}
                          alt={(session.user as User).name || "User"}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white truncate">
                          {session.user.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href="/profile">
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </button>
                  </Link>

                  <Link href="/my-bookings">
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>My Bookings</span>
                    </button>
                  </Link>
                  <Link href="/my-wishlist">
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Heart className="w-5 h-4" />
                      <span>My Wishlist</span>
                    </button>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600 dark:text-red-400 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-brand-primary hover:bg-brand-primaryDark text-white px-6 py-2 rounded-full font-medium transition-all duration-300">
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none group"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-50 ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 space-y-4">
          {menuItems.map((item, idx) => {
            let href = "/";
            if (item === "Contacts") href = "/contacts";
            else if (item === "Location") href = "/location";
            else if (item === "Login") href = "/login";
            else if (item === "Havens") href = "/rooms";
            else if (item === "About") href = "/about";

            const isActive = pathname === href;

            return (
              <div
                key={idx}
                className={`transform transition-all duration-300 ${
                  isMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <Link href={href}>
                  <div
                    className={`${
                      isActive
                        ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-gray-800 font-semibold border-l-4 border-orange-600 dark:border-orange-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-gray-800"
                    } transition-colors duration-300 font-medium py-2 px-4 rounded-lg cursor-pointer`}
                  >
                    {item}
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Mobile Dark Mode Toggle */}
          {mounted && (
            <div
              className={`transform transition-all duration-300 ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: `${menuItems.length * 50}ms` }}
            >
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors duration-300 rounded-lg"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-orange-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          )}

          {/* Mobile CTA Button / User Profile */}
          <div
            className={`transform transition-all duration-300 ${
              isMenuOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: `${(menuItems.length + 1) * 50}ms` }}
          >
            {status === "loading" ? (
              <div className="w-full h-12 rounded-lg bg-gray-200 animate-pulse"></div>
            ) : session?.user ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border-2 border-orange-200 dark:border-gray-600">
                  {(session.user as User).profile_image_url ||
                  (session.user as User).image ? (
                    <img
                      src={(session.user as User).profile_image_url ||
                      (session.user as User).image}
                      alt={(session.user as User).name || "User"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                {/* Profile Button */}
                <Link href="/profile">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-lg font-medium transition-all duration-300 shadow-md"
                  >
                    <User className="w-5 h-5" />
                    <span>My Profile</span>
                  </button>
                </Link>
                {/* My Bookings Button */}
                <Link href="/my-bookings">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>My Bookings</span>
                  </button>
                </Link>
                {/* My Wishlist Button */}
                <Link href="/my-wishlist">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-lg font-medium transition-all duration-300 shadow-md"
                  >
                    <Heart className="w-5 h-5" />
                    <span>My Wishlist</span>
                  </button>
                </Link>

                {/* Sign Out Button */}
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-300 shadow-md"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-md">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm top-16 z-40 animate-fade-in"
        ></div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;