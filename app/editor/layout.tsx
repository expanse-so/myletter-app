"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  MenuIcon, 
  HomeIcon, 
  FileEditIcon, 
  MailIcon, 
  UsersIcon, 
  SettingsIcon, 
  LogOutIcon
} from "lucide-react"

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Editor", href: "/editor", icon: FileEditIcon },
    { name: "Newsletters", href: "/newsletters", icon: MailIcon },
    { name: "Subscribers", href: "/subscribers", icon: UsersIcon },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <div className="ml-4 lg:ml-0 font-semibold text-xl">MyLetter</div>
          <div className="ml-auto flex items-center gap-4">
            <Button size="sm" asChild>
              <Link href="/dashboard">Exit Editor</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-lg transition-transform lg:translate-x-0 lg:static lg:w-20 xl:w-64 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-4 lg:hidden">
            <div className="font-semibold text-xl">MyLetter</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          <nav className="flex flex-col gap-1 p-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="hidden xl:inline">{item.name}</span>
              </Link>
            ))}
            <Link
              href="/logout"
              className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-foreground hover:bg-muted"
            >
              <LogOutIcon className="h-5 w-5 shrink-0" />
              <span className="hidden xl:inline">Log out</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-0">{children}</main>
      </div>
    </div>
  )
}