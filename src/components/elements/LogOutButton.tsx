"use client";
import React from "react";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";

const LogoutButton = () => {
  const supabase = createClient();
  return <Button onClick={() => supabase.auth.signOut()}>Log out</Button>;
};

export default LogoutButton;
