"use client";

import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
<<<<<<< HEAD
import Spinner from "./Spinner"
=======
>>>>>>> ad7dbccb24383d2add77931ecb7e9525bd427a64
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setCheckInDate, setCheckOutDate, setGuests } from "@/redux/slices/bookingSlice";
import { signIn } from "next-auth/react";
import Footer from "./Footer";
import Image from "next/image";

const Login = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSocialLogin = async (provider: string) => {
    setIsGoogleLoading(true);

    try {
      if (provider.toLowerCase() === "google") {
        await signIn("google", { callbackUrl: "/rooms" });
      } else {
        alert(`${provider} login not yet implemented`);
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
      setIsGoogleLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setIsGuestLoading(true);

    // Set smart defaults: today + tomorrow + 2 guests
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format dates as YYYY-MM-DD for the date pickers
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Set booking data with smart defaults
    dispatch(setCheckInDate(formatDate(today)));
    dispatch(setCheckOutDate(formatDate(tomorrow)));
    dispatch(setGuests({ adults: 2, children: 0, infants: 0 }));

    setTimeout(() => {
      router.push("/rooms");
      setIsGuestLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col pt-14 sm:pt-16">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Main Container */}
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            {/* Logo/Home Link */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                aria-label="Go to homepage"
              >
                <Image
                  src="/haven_logo.png"
                  alt="Staycation Haven Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
                <span className="text-xl font-display text-brand-primary dark:text-brand-primary">
                  taycation Haven
                </span>
              </button>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Sign in to continue your booking
              </p>
            </div>

            {/* Google Sign In */}
            <div className="mb-6">
              <button
                onClick={() => handleSocialLogin("google")}
                disabled={isGoogleLoading || isGuestLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Continue with Google"
              >
                {isGoogleLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-red-200 dark:border-red-900 border-t-red-600 dark:border-t-red-500 rounded-full animate-spin"></div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Processing...
                    </span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 text-red-600 dark:text-red-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Continue with Google
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                  Or continue as guest
                </span>
              </div>
            </div>

            {/* Guest Login */}
            <div className="mb-8">
              <button
                onClick={handleGuestLogin}
                disabled={isGoogleLoading || isGuestLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-primary hover:bg-brand-primaryDark text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Continue as Guest"
              >
                {isGuestLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-orange-300/40 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue as Guest</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Guest users can book rooms with smart defaults
              </p>
            </div>

            {/* Terms */}
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By continuing, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-brand-primary hover:text-brand-primaryDark underline transition-colors"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-brand-primary hover:text-brand-primaryDark underline transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;