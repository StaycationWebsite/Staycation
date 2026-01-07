"use client";

import { Facebook, Instagram, MapPin } from "lucide-react";
import SocialIcon from "./SocialIcon";
import Link from "next/link";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className="bg-gray-600 text-gray-300 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Center Content */}
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Company Info */}
          <div className="animate-in slide-in-from-top duration-700">
            <h2 className="py-2 text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-3">
              Staycation Haven
            </h2>
            <p className="text-gray-400 text-lg">
              Your perfect city escape awaits
            </p>
          </div>

          {/* Location */}
          <div
            className="flex items-center justify-center gap-3 animate-in fade-in divide-gray-700"
            style={{ animationDelay: "100ms" }}
          >
            <MapPin className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-semibold text-white">123 Makati Avenue</p>
              <p className="text-gray-400 ">Quezon City, Philippines</p>
            </div>
          </div>

          {/* Social Media Icons */}
          <div
            className="flex justify-center gap-6 animat-in fade-in duration-700"
            style={{ animationDelay: "200ms" }}
          >
            <SocialIcon
              icon={<Facebook className="w-6 h-6" />}
              label="Facebook"
              href="https://www.facebook.com/staycationhavenph"
            />
            <SocialIcon
              icon={<Instagram className="w-6 h-6" />}
              label="Instagram"
              href="https://www.instagram.com/staycationhavenph/?igsh=aDQ5NzNhOGk3eG9x#"
            />
            <Link
              href="https://www.tiktok.com/@staycationhavenph"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              aria-label="TikTok"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 0 1-2.4 2.4 2.4 2.4 0 0 1-2.4-2.4 2.4 2.4 0 0 1 2.4-2.4c.18 0 .37.02.55.05V9.54a6.05 6.05 0 0 0-.55-.05A6.07 6.07 0 0 0 5 15.74a6.06 6.06 0 0 0 6.09 6.05 6.06 6.06 0 0 0 6.09-6.05V8.93a7.72 7.72 0 0 0 3.4 1.94v-3.6a4.27 4.27 0 0 1-.86-.1z" />
              </svg>
            </Link>

            <Link
              href="https://www.google.com/maps/place/Staycation+Haven+PH+Quezon+City/@14.6398147,121.0305229,17z/data=!3m1!4b1!4m9!3m8!1s0x33bd6b03c2fec51b:0xdf26cdeed4a6fa95!5m2!4m1!1i2!8m2!3d14.6398095!4d121.0330978!16s%2Fg%2F11wbjs35zm?entry=tts&g_ep=EgoyMDI1MDkxNi4wIPu8ASoASAFQAw%3D%3D&skid=de1f204e-7a5b-4970-ba32-0de16551f6ff"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              aria-label="Location"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2" // ✅ camelCase
                strokeLinecap="round" // ✅ camelCase
                strokeLinejoin="round" // ✅ camelCase
                className="lucide lucide-map-pin-icon lucide-map-pin"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
