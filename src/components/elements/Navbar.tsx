"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { toast } = useToast();

  const params = useParams();

  useEffect(() => {
    const getLoggedIn = async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      console.log(data);
      console.log(error);

      if (!error && data?.user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    };
    getLoggedIn();
  }, [params]);

  const handleLogout = () => {
    const supabase = createClient();
    supabase.auth.signOut();

    setLoggedIn(false);
    // Show toast notification for logout
    toast({ title: "Logged out", description: "success", variant: "success" });
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
          {loggedIn ? (
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
// m.azzam.azis@gmail.com
