import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border py-4">
        <div className="container flex justify-between items-center">
          <div className="text-2xl font-bold">MyLetter</div>
          <nav className="space-x-4">
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="block">Cursor for newsletters.</span>
              <span className="block mt-2 text-primary">AI-powered, minimalist, effective.</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Create exceptional newsletters with AI assistance in a clean, 
              distraction-free environment designed for content creators who value simplicity.
            </p>
            <div className="mt-10">
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground py-3 px-6 rounded-md hover:bg-primary/90 text-lg font-medium"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">AI Collaboration</h3>
                <p className="text-muted-foreground">
                  Chat with AI to craft your content while seeing 
                  the results in real-time with a split-view interface.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Minimalist Editor</h3>
                <p className="text-muted-foreground">
                  A clean, distraction-free editor that puts your content 
                  front and center with powerful formatting tools.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Simple Management</h3>
                <p className="text-muted-foreground">
                  Manage subscribers, schedule deliveries, and track performance 
                  with an intuitive dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} MyLetter. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}