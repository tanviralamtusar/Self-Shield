import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { requireAuth } from '@/lib/api-helpers';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background z-10 shrink-0">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="font-semibold text-sm">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-muted/20">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
