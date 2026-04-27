'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, Zap, Globe, Search, Lock, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export function StrictProtection() {
  const [settings, setSettings] = useState({
    safeSearch: false,
    tamperProtection: true,
    preventUninstall: true,
    lockAccessibility: true,
    blockSystemSettings: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    
    if (newValue) {
      toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} Enabled`, {
        description: 'Protection policy updated successfully.',
      });
    } else {
      toast.warning(`${key.replace(/([A-Z])/g, ' $1').trim()} Disabled`, {
        description: 'Device security level decreased.',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header section with glassmorphism */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 border border-primary/20 backdrop-blur-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5 animate-in fade-in slide-in-from-left-4 duration-1000">Strict Enforcement Mode</Badge>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Advanced Protection</h2>
          <p className="text-muted-foreground max-w-md">Deploy military-grade tamper protection and global filtering policies.</p>
        </div>
        <div className="relative z-10 flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Security Level</span>
              <span className="text-xl font-black text-primary italic">LEVEL 4 / MAX</span>
           </div>
           <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse">
              <Zap className="h-6 w-6 text-white" />
           </div>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-stretch">
        {/* Universal SafeSearch */}
        <Card className="h-full border-none bg-secondary/30 backdrop-blur-md shadow-2xl shadow-black/5 ring-1 ring-white/10 overflow-hidden group flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Search className="h-6 w-6" />
              </div>
              <Switch 
                checked={settings.safeSearch}
                onCheckedChange={() => toggleSetting('safeSearch')}
              />
            </div>
            <CardTitle className="text-2xl mt-4">Universal SafeSearch</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Force strict filtering on Google, Bing, YouTube, and all major search engines. Cannot be bypassed via private browsing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
             <div className="p-4 rounded-xl bg-background/50 border border-white/5 space-y-3">
                <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                   Force Restricted Mode on YouTube
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                   Bypass Proxy/VPN Search Redirects
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Tamper Protection Main Toggle */}
        <Card className={`h-full border-none transition-all duration-500 flex flex-col ${settings.tamperProtection ? 'bg-primary/5 ring-1 ring-primary/30' : 'bg-secondary/30 ring-1 ring-white/10'}`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl transition-colors duration-500 ${settings.tamperProtection ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground'}`}>
                <Lock className="h-6 w-6" />
              </div>
              <Switch 
                checked={settings.tamperProtection}
                onCheckedChange={() => toggleSetting('tamperProtection')}
              />
            </div>
            <CardTitle className="text-2xl mt-4">Tamper Protection</CardTitle>
            <CardDescription>
              Prevents users from disabling Self-Shield, changing system settings, or removing the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
             {settings.tamperProtection ? (
               <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="grid gap-2 ml-4 py-2">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background/40 transition-colors group/item">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold uppercase tracking-wider">Prevent Uninstall</Label>
                        <p className="text-[10px] text-muted-foreground">Locks Device Admin & App Removal</p>
                      </div>
                      <Switch 
                        checked={settings.preventUninstall}
                        onCheckedChange={() => toggleSetting('preventUninstall')}
                        className="scale-75 data-[state=checked]:bg-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background/40 transition-colors group/item">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold uppercase tracking-wider">Lock Accessibility</Label>
                        <p className="text-[10px] text-muted-foreground">Prevents disabling the core engine</p>
                      </div>
                      <Switch 
                        checked={settings.lockAccessibility}
                        onCheckedChange={() => toggleSetting('lockAccessibility')}
                        className="scale-75 data-[state=checked]:bg-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background/40 transition-colors group/item">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold uppercase tracking-wider">Settings Lock</Label>
                        <p className="text-[10px] text-muted-foreground">Block access to System Settings</p>
                      </div>
                      <Switch 
                        checked={settings.blockSystemSettings}
                        onCheckedChange={() => toggleSetting('blockSystemSettings')}
                        className="scale-75 data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full py-6 text-center space-y-3 opacity-50 grayscale">
                  <ShieldAlert className="h-10 w-10 text-muted-foreground" />
                  <p className="text-xs font-medium">Protection is currently offline.<br/>The device is vulnerable to tampering.</p>
               </div>
             )}
          </CardContent>
        </Card>
      </div>

      {/* OS Compatibility Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
         <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 flex flex-col items-center text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
               <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <h4 className="font-bold text-sm">Android Enterprise</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Device Owner mode prevents Settings bypass and Safe Mode tampering.</p>
         </div>
         <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 flex flex-col items-center text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-slate-500/10 flex items-center justify-center mb-2">
               <Smartphone className="h-5 w-5 text-slate-500" />
            </div>
            <h4 className="font-bold text-sm">iOS Supervised</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">MDM integration enforces non-removable management profile and global HTTP proxy.</p>
         </div>
         <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 flex flex-col items-center text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
               <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-bold text-sm">Always-On VPN</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Locks network traffic through Self-Shield, preventing DNS bypass even with 5G/LTE.</p>
         </div>
      </div>
    </div>
  );
}
