import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        try {
          const store = cookies();
          return store.get(name)?.value;
        } catch {
          return undefined;
        }
      },
      set(name: string, value: string, options: any) {
        try {
          const store = cookies();
          store.set({ name, value, ...options });
        } catch {}
      },
      remove(name: string, options: any) {
        try {
          const store = cookies();
          store.set({ name, value: "", ...options });
        } catch {}
      },
    },
  });
}


