"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    toast({ title: "Logged out", description: "success" });
  };

  return (
    <nav className="w-full top-0 bg-white border-b border-gray-200 px-6 py-4 sticky flex justify-between items-center z-[9999] shadow-sm">
      <Link
        href={"/"}
        className="text-2xl font-semibold text-primary hover:text-primary-600 transition-colors"
      >
        Cite Smart
      </Link>
      <div>
        <ul className="flex gap-4 items-center">
          {isLoggedIn ? (
            <li>
              <Button
                onClick={handleLogout}
                size={"lg"}
                variant="outline"
                className="hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Logout
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
