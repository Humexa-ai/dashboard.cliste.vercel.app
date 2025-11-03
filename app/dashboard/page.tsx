import Dashboard from "@/components/kokonutui/dashboard"
import { SignedIn } from "@clerk/nextjs"

export default function DashboardPage() {
  return (
    <SignedIn>
      <Dashboard />
    </SignedIn>
  )
}
