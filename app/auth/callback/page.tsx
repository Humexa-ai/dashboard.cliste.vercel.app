"use client";
import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      window.location.replace(error ? "/sign-in?error=callback" : "/dashboard");
    };
    run();
  }, []);
  return null;
}










