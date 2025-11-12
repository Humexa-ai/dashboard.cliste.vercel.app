"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, LogOut, MessagesSquare, Phone, Calendar, CalendarCheck, CreditCard, Sparkles, Receipt, Inbox } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export default function AceternityLayout({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Chats",
      href: "/dashboard/chats",
      icon: (
        <MessagesSquare className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Voice Calls",
      href: "/dashboard/calls",
      icon: (
        <Phone className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Inbox",
      href: "/dashboard/inbox",
      icon: (
        <Inbox className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: (
        <Calendar className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Bookings",
      href: "/dashboard/bookings",
      icon: (
        <CalendarCheck className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "AI Assistant",
      href: "/dashboard/ai",
      icon: (
        <Sparkles className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Billing",
      href: "/dashboard/billing",
      icon: (
        <CreditCard className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();
  const [hasSession, setHasSession] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [companyName, setCompanyName] = useState<string>("Cliste Limited");

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (!session) {
        router.replace("/sign-in");
      } else {
        setHasSession(true);
        // Fetch company name from user metadata or organization
        if (session.user) {
          // Try to get company name from user metadata
          const metadata = session.user.user_metadata;
          if (metadata?.company_name) {
            setCompanyName(metadata.company_name);
          } else if (metadata?.organization_name) {
            setCompanyName(metadata.organization_name);
          }
        }
      }
      setIsReady(true);
    });
    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  if (!isReady || !hasSession) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-2xl flex flex-col md:flex-row bg-[#0A0C0F] dark:bg-[#0A0C0F] w-full flex-1 mx-auto overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex h-full flex-col items-center justify-between py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-1 flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center"
            >
              <Logo />
            </motion.div>
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col gap-3 w-full items-center">
                {links.map((link, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                  >
                    <SidebarLink link={link} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 w-full flex justify-center"
          >
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/sign-in";
              }}
              className="flex items-center justify-center py-2 px-6 w-full rounded-lg transition-all duration-200 hover:bg-neutral-800/50 [&>svg]:transition-all [&>svg]:duration-200 hover:[&>svg]:scale-110 hover:[&>svg]:text-white/90"
            >
              <LogOut className="text-white h-5 w-5 flex-shrink-0" />
            </button>
          </motion.div>
        </SidebarBody>
      </Sidebar>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-1 items-start justify-center m-0 md:m-4 lg:m-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative border-0 md:border md:border-neutral-200 md:dark:border-neutral-700 bg-[#0A0C0F] rounded-none md:rounded-2xl flex flex-col gap-2 w-full h-full overflow-hidden"
        >
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden p-4 md:p-6">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="flex items-center justify-center"
    >
      <Image
        src="/cliste-logo.png"
        alt="Cliste"
        width={50}
        height={50}
        className="flex-shrink-0"
        priority
      />
    </Link>
  );
};


