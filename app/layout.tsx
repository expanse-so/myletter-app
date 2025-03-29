import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { runMigrations } from "@/lib/migrations";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyLetter - Newsletter Management",
  description: "Simple newsletter management app",
};

// This is run on the server once at build time
if (typeof window === 'undefined') {
  // Run migrations in development or when deployed
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV) {
    console.log('Running migrations during build...');
    runMigrations().catch(err => {
      console.error('Error running migrations:', err);
    });
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}