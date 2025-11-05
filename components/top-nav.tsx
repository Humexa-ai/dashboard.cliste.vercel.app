"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import Profile01 from "./profile-01"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function TopNav() {
  const [companyLabel, setCompanyLabel] = useState<string | null>(null)
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user
      const meta: any = user?.user_metadata || {}
      let name: string | undefined = meta.companyName || undefined
      if (!name) {
        const fn = meta.firstName || ""
        const ln = meta.lastName || ""
        const full = `${fn} ${ln}`.trim()
        if (full) name = full
      }
      if (name) {
        const low = name.trim().toLowerCase()
        if (!/(?:\s|^)(limited|ltd)\s*$/.test(low)) {
          name = `${name.trim()} Limited`
        }
        setCompanyLabel(name)
      } else if (user?.email) {
        setCompanyLabel(user.email)
      }
    })
  }, [])
  const today = new Date()
  const dateLabel = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0"
  const versionLabel = `v${version}`.replace(/^v+v/, "v")
  const breadcrumbs: BreadcrumbItem[] = [
    { label: dateLabel },
    { label: versionLabel },
    { label: "Appointify" },
  ]

  return (
    <nav className="relative px-3 sm:px-6 pl-12 md:pl-6 flex items-center justify-between bg-gray-100 border-b border-gray-200 h-full">
      <div className="font-medium text-sm hidden md:flex items-center space-x-1 truncate max-w-[60vw]">
        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-500 mx-1" />}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900">{item.label}</span>
            )}
          </div>
        ))}
      </div>


      <div className="flex items-center gap-3 sm:gap-4 ml-auto sm:ml-0">
        {companyLabel ? (
          <span className="text-sm text-gray-700">Signed into {companyLabel}</span>
        ) : (
          <>
            <a href="/sign-in" className="text-sm text-gray-700 hover:underline">Sign in</a>
            <a href="/sign-up" className="text-sm text-gray-700 hover:underline">Sign up</a>
          </>
        )}
      </div>
    </nav>
  )
}
