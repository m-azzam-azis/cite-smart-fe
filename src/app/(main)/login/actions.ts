"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/login?status=error&message=Email and password are required.");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(
      `/login?status=error&message=${encodeURIComponent(error.message)}`
    );
  } else {
    revalidatePath("/", "layout");
    redirect("/?status=success&message=Logged in successfully.");
  }
}
