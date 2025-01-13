"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const { isLoggedIn, user, supabase } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        toast({
          title: "Logged out",
          description: `See you later, ${user?.email}!`,
          variant: "success",
        });
        router.push("/");
        router.refresh();
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="w-full top-0 bg-white border-b border-gray-200 px-6 py-4 sticky flex justify-between items-center z-[9999] shadow-sm">
      <div className="flex items-center justify-center">
        <Link
          href={"/"}
          className="text-2xl font-semibold text-primary hover:text-primary-600 transition-colors"
        >
          Cite Smart
        </Link>
        <Link
          href={"/dashboard"}
          className="ml-12 hover:text-gray-700 hover:-translate-y-1 transition-all"
        >
          Dashboard
        </Link>
      </div>
      <div>
        <ul className="flex gap-4 items-center">
          {isLoggedIn ? (
            <li>
              <Button
                onClick={handleLogout}
                size={"lg"}
                variant="outline"
                disabled={isLoggingOut}
                className="hover:bg-red-50 hover:text-red-600 transition-colors min-w-[100px]"
              >
                {isLoggingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Logging out...
                  </div>
                ) : (
                  "Logout"
                )}
              </Button>
            </li>
          ) : (
            <>
              <li>
                <Link href={"/login"}>
                  <Button size={"lg"} variant="outline">
                    Login
                  </Button>
                </Link>
              </li>
              <li>
                <Link href={"/signup"}>
                  <Button size={"lg"} variant="secondary">
                    Sign up
                  </Button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
