'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BackButton } from '@/components/ui/BackButton';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 h-14 border-b flex items-center justify-between px-4 bg-background/80 backdrop-blur-md z-20 shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          {pathname !== '/' && <BackButton />}
          <h1 className="font-semibold text-sm">
            {pathname === '/' ? 'Dashboard' : 
             pathname.split('/').pop()?.charAt(0).toUpperCase()! + pathname.split('/').pop()?.slice(1)}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
