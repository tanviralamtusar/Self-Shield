'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Shield, LayoutDashboard, ShieldBan, Lock, FileText, Settings, LogOut, Activity, MonitorSmartphone, Globe, Zap } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { TamperAlertListener } from './TamperAlertListener';
import { OverrideNotificationListener } from './OverrideNotificationListener';
import { ThemeToggle } from '../ThemeToggle';


const menuItems = [
  { title: 'Overview', url: '/', icon: LayoutDashboard },
  { title: 'Devices', url: '/devices', icon: MonitorSmartphone },
  { title: 'Blocklists', url: '/blocklists', icon: ShieldBan },
  { title: 'Strict Mode', url: '/protection', icon: Zap },
  { title: 'Overrides', url: '/overrides', icon: Lock },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Audit Log', url: '/audit', icon: Activity },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <TamperAlertListener />
      <OverrideNotificationListener />
      <Sidebar>
        <SidebarHeader className="h-20 border-b px-6 flex flex-col justify-center shrink-0 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center gap-3 font-bold text-primary">
            <div className="p-2 rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-none tracking-tight">Self-Shield</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Admin Authority</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      render={<Link href={item.url} />} 
                      isActive={pathname === item.url}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
        <div className="mt-auto p-4 border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleLogout} 
                className="group relative h-10 w-full overflow-hidden rounded-xl border border-transparent bg-primary/5 text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-[0_0_15px_rgba(45,127,249,0.4)] active:scale-95"
              >
                <div className="flex items-center justify-center w-full gap-2 font-semibold">
                  <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  <span>Sign Out</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>
    </>
  );
}
