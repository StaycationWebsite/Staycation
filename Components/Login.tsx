"use client";

import { Apple, ArrowRight, Facebook, Home, Mail } from "lucide-react";
import { useState } from "react";
import SocialLoginButton from "./SoclalLoginButton";
import Spinner from "./Spinner"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setCheckInDate, setCheckOutDate, setGuests } from "@/redux/slices/bookingSlice";
import { signIn } from "next-auth/react";
import Footer from "./Footer";

interface SocialLoginOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const SocialLoginOptions: SocialLoginOption[] = [
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "bg-blue-600",
      hoverColor: "bg-blue-700",
    },
    {
      id: "google",
      name: "Google",
      icon: <Mail className="w-5 h-5" />,
      color: "bg-red-600",
      hoverColor: "bg-red-700",
    },
    {
      id: "apple",
      name: "Apple",
      icon: <Apple className="w-5 h-5" />,
      color: "bg-gray-800",
      hoverColor: "bg-gray-900",
    },
  ];

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);

    try {
      if (provider.toLowerCase() === "google") {
        // NextAuth Google sign in - redirects to /rooms after successful login
        await signIn("google", { callbackUrl: "/rooms" });
      } else {
        // For other providers not yet implemented
        alert(`${provider} login not yet implemented`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setIsLoading(true);

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
      // Navigate to rooms page with all rooms showing (no filters)
      router.push("/rooms");
      setIsLoading(false);
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primaryLighter via-white to-brand-primarySoft dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-brand-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-brand-primaryDark rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-6 sm:mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-primary to-brand-primaryDark rounded-full flex items-center justify-center shadow-lg" aria-hidden="true">
              <Home className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-primaryDark bg-clip-text text-transparent mb-2">
            Staycation Haven
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">Your perfect city escape</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom duration-700 border border-gray-100 dark:border-gray-700" style={{ animationDelay: '100ms' }}>
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6 sm:mb-8">
            Choose how you would like to continue
          </p>

          {/* Connect With Section */}
          <div className="mb-8 animate-in fade-in duration-700" style={{ animationDelay: '200ms' }}>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
              Connect With
            </h3>
            <div className="space-y-3">
              {SocialLoginOptions.map((option, index) => (
                <div
                  key={option.id}
                  className="animate-in fade-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <SocialLoginButton
                    option={option}
                    onClick={() => handleSocialLogin(option.name)}
                    aria-label={`Continue with ${option.name}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-8 animate-in fade-in duration-700" style={{ animationDelay: '600ms' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR</span>
            </div>
          </div>

          {/* Continue as Guest Section */}
          <div className="animate-in fade-in slide-in-from-right duration-700" style={{ animationDelay: '700ms' }}>
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 px-6 rounded-lg border-2 border-brand-primary bg-white dark:bg-gray-800 hover:bg-brand-primaryLighter dark:hover:bg-brand-primaryLighter text-brand-primary hover:text-brand-primaryDark dark:text-brand-primary dark:hover:text-brand-primaryDark transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg min-h-[48px]"
              aria-label="Continue as Guest"
            >
              <span>Continue as Guest</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8 animate-in fade-in duration-700" style={{ animationDelay: '800ms' }}>
            By continuing, you agree to our <br />
            <a href="/terms-of-service" className="text-brand-primary hover:text-brand-primaryDark transition-colors">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy-policy" className="text-brand-primary hover:text-brand-primaryDark transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
              <Spinner label="Processing your login"/>
        )}
      </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
