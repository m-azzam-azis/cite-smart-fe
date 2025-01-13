"use client";

import DashboardSidebar from "@/components/elements/Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setIsLoggedIn, supabase } = useAuth();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Only redirect if we've confirmed auth state and user is not logged in

    supabase.auth.getUser().then(({ error, data }) => {
      if (error !== null && data.user === null) {
        router.replace("/login");
      }
      // Mark auth as checked once we get a definitive user state
      if (data.user !== undefined) {
        setIsAuthChecked(true);
        setIsLoggedIn(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show nothing while checking auth
  if (!isAuthChecked) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <ProjectProvider>
      <div className="md:flex w-full h-screen">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </ProjectProvider>
  );
}
