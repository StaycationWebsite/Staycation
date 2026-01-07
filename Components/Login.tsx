"use client";

import { Apple, ArrowRight, Facebook, Home, Mail } from "lucide-react";
import { useState } from "react";
import SocialLoginButton from "./SoclalLoginButton";
import Spinner from "./Spinner"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setCheckInDate, setCheckOutDate, setGuests } from "@/redux/slices/bookingSlice";
import { signIn } from "next-auth/react";

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
       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Home className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            Staycation Haven
          </h1>
          <p className="text-gray-600 text-lg">Your perfect city escape</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: '100ms' }}>
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Choose how you would like to continue
          </p>

          {/* Connect With Section */}
          <div className="mb-8 animate-in fade-in duration-700" style={{ animationDelay: '200ms' }}>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
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
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-8 animate-in fade-in duration-700" style={{ animationDelay: '600ms' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Continue as Guest Section */}
          <div className="animate-in fade-in slide-in-from-right duration-700" style={{ animationDelay: '700ms' }}>
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg border-2 border-orange-500 bg-white hover:bg-orange-50 text-orange-600 hover:text-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue as Guest</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500 mt-8 animate-in fade-in duration-700" style={{ animationDelay: '800ms' }}>
            By continuing, you agree to our <br />
            <a href="#" className="text-orange-600 hover:text-orange-700 transition-colors">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-orange-600 hover:text-orange-700 transition-colors">
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
  );
};

export default Login;
