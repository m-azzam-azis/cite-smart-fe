"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

export default function DashboardSidebar() {
  const { user } = useAuth();
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 rounded-r-lg">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden ">
          {/* {open ? <Logo /> : <LogoIcon />} */}
          <Link
            href="/"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 h-8"
          >
            <Sparkles size={24} className="fill-primary text-primary" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-primary dark:text-white whitespace-pre text-xl"
            >
              <span className={`${open ? "block" : "hidden"}`}>Cite Smart</span>
            </motion.span>
          </Link>
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: `Logged in as: \n${user?.email}` || "User",
              href: "#",
              icon: (
                <Image
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

// export const LogoIcon = () => {
//   return (
//     <Link
//       href="#"
//       className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 h-8"
//     >
//       <Sparkles size={24} className="fill-primary text-primary" />
//     </Link>
//   );
// };
