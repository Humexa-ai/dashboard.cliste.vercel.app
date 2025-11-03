"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import Profile01 from "./profile-01"
import Link from "next/link"
import { UserButton, useOrganization, useUser, useOrganizationList } from "@clerk/nextjs"

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function TopNav() {
  const { organization } = useOrganization()
  const { user } = useUser()
  const { organizationList, isLoaded: orgsLoaded } = useOrganizationList()
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
        <span className="hidden sm:block text-sm text-gray-700">Logged in as {organization?.name || (orgsLoaded && organizationList?.[0]?.organization?.name) || user?.fullName || user?.emailAddresses?.[0]?.emailAddress}</span>
        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
      </div>
    </nav>
  )
}
