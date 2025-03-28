'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  LayoutDashboard, 
  Mail, 
  Menu, 
  Search, 
  Settings, 
  User, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { Newsletter } from '@/types/database';

interface ActivityItem {
  id: string;
  action: string;
  target: string;
  time: string;
  user: {
    name: string;
    avatar: string;
  };
}

interface DashboardLayoutProps {
  newsletters?: Newsletter[];
  activities?: ActivityItem[];
  children?: React.ReactNode;
}

export function DashboardLayout({
  newsletters = [],
  activities = [],
  children,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <span className="font-medium text-xl hidden md:inline-block">MyLetter</span>
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/newsletters" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Newsletters
              </Link>
              <Link href="/subscribers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Subscribers
              </Link>
              <Link href="/settings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 hover:bg-accent transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <button 
              onClick={handleSignOut}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background pt-16">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5 text-foreground" />
              <span className="text-foreground">Dashboard</span>
            </Link>
            <Link 
              href="/newsletters" 
              className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Newsletters</span>
            </Link>
            <Link 
              href="/subscribers" 
              className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Subscribers</span>
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Settings</span>
            </Link>
            <div className="border-t border-border my-2 pt-2">
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent w-full text-left"
              >
                <X className="h-5 w-5 text-destructive" />
                <span className="text-destructive">Sign out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}