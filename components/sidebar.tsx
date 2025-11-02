"use client"

import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Menu,
  X,
  LogOut,
} from "lucide-react"

import { Home } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { useOrganization, useUser, SignOutButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { organization } = useOrganization()
  const { user } = useUser()
  const [billingLoading, setBillingLoading] = useState(false)
  const router = useRouter()

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    icon: any
    children: React.ReactNode
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/5"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    )
  }

  function openBillingPortal() {
    setBillingLoading(true)
    router.push("/org/profile")
  }

  return (
    <>
      {!isMobileMenuOpen && (
      <button
        type="button"
          aria-label="Open menu"
          className="lg:hidden fixed top-4 left-4 z-[90] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
          onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      )}
      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-[#0a0a0a] transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-white/10
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 px-6 flex items-center border-b border-white/10">
            <div className="flex items-center gap-3">
              <Image src="/cliste-logo.png" alt="Cliste" width={42} height={42} className="flex-shrink-0" />
              <span className="text-lg font-semibold text-white">ClisteOS</span>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              className="ml-auto lg:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Overview
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Home}>
                    Dashboard
                  </NavItem>
                  <NavItem href="#" icon={BarChart2}>
                    Analytics
                  </NavItem>
                  <NavItem href="#" icon={Building2}>
                    Organization
                  </NavItem>
                  <NavItem href="#" icon={Folder}>
                    Projects
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Finance
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Wallet}>
                    Transactions
                  </NavItem>
                  <NavItem href="#" icon={Receipt}>
                    Invoices
                  </NavItem>
                  <NavItem href="#" icon={CreditCard}>
                    Payments
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Team
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Users2}>
                    Members
                  </NavItem>
                  <NavItem href="#" icon={Shield}>
                    Permissions
                  </NavItem>
                  <NavItem href="#" icon={MessagesSquare}>
                    Chat
                  </NavItem>
                  <NavItem href="#" icon={Video}>
                    Meetings
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={openBillingPortal}
              disabled={billingLoading}
              className="flex w-full items-center px-3 py-2 text-sm rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/5 cursor-pointer select-none disabled:opacity-60"
            >
              <CreditCard className="h-4 w-4 mr-3 flex-shrink-0" />
              {billingLoading ? "Opening Billing..." : "Manage Billing"}
            </button>
            <SignOutButton signOutOptions={{ redirectUrl: "/sign-in" }}>
              <div className="flex w-full items-center px-3 py-2 text-sm rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/5 cursor-pointer select-none">
                <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
                Logout
            </div>
            </SignOutButton>
          </div>
        </div>
      </nav>

      {/* Removed dark page overlay on mobile to keep right-side content visible */}
    </>
  )
}
