import DashboardSidebar from "@/modules/Dashboard";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <div className="flex w-full h-screen">
      <DashboardSidebar />
      {children}
    </div>
  );
}
