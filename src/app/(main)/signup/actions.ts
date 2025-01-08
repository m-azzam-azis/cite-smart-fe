"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("password-confirm") as string;
  console.log(email);
  console.log(password);
  console.log(passwordConfirm);

  if (!email || !password || !passwordConfirm) {
    redirect("/signup?status=error&message=Email and password are required.");
    return;
  }
  if (password != passwordConfirm) {
    redirect("/signup?status=error&message=Password doesn't match.");
    return;
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect(
      `/signup?status=error&message=${encodeURIComponent(error.message)}`
    );
  } else {
    revalidatePath("/", "layout");
    redirect("/login?status=success&message=Signed up successfully.");
  }
}
