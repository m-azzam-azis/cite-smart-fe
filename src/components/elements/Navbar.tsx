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
    toast({ title: "Logged out", description: "success" });
  };

  return (
    <nav className="w-full top-0 bg-blue-300 px-4 py-2 sticky flex justify-between z-[9999]">
      <Link href={"/"}>Cite Smart</Link>
      <div>
        <ul className="flex gap-4">
          {loggedIn ? (
            <li>
              <Button onClick={handleLogout}>Logout</Button>
            </li>
          ) : (
            <>
              <li>
                <Button>
                  <Link href={"/login"}>Login</Link>
                </Button>
              </li>
              <li>
                <Button>
                  <Link href={"/signup"}>Sign Up</Link>
                </Button>
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
