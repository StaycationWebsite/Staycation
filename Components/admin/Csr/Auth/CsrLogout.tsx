"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";

interface CsrLogoutProps {
  sidebar: boolean;
}

export default function CsrLogout({ sidebar }: CsrLogoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/admin/login",
        redirect: true
      })
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
    >
      <LogOut className="w-5 h-5" />
      {sidebar && <span className="text-sm">Logout</span>}
    </button>
  );
}