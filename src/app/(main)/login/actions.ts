"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect('/login?toast_type=destructive&toast_title=Error&toast_message=Email and password are required');
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?toast_type=destructive&toast_title=Error&toast_message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(`/?toast_type=success&toast_title=Welcome back!&toast_message=Successfully logged in as ${email}`);
}
