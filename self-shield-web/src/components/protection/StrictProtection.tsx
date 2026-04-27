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
    globalUninstallBlock: false,
  });

  const [protectedApps, setProtectedApps] = useState(['com.android.settings', 'com.selfshield.app']);
  const [newApp, setNewApp] = useState('');

  const toggleSetting = (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    
    toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${newValue ? 'Enabled' : 'Disabled'}`, {
      description: 'Device policy updated.',
    });
  };

  const addApp = () => {
    if (newApp && !protectedApps.includes(newApp)) {
      setProtectedApps([...protectedApps, newApp]);
      setNewApp('');
      toast.success('App Protected', { description: `${newApp} added to protected list.` });
    }
  };

  const removeApp = (pkg: string) => {
    setProtectedApps(protectedApps.filter(a => a !== pkg));
    toast.info('Protection Removed', { description: `${pkg} removed from list.` });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 border border-primary/20 backdrop-blur-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5">Strict Enforcement Mode</Badge>
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
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Column 1: Network & Persistence */}
        <div className="space-y-8">
           {/* Universal SafeSearch */}
           <Card className="border-none bg-secondary/30 backdrop-blur-md shadow-2xl shadow-black/5 ring-1 ring-white/10 overflow-hidden group flex flex-col">
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
                <CardTitle className="text-xl mt-4">Universal SafeSearch</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Force strict filtering on Google, Bing, YouTube, and all major search engines.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                 <div className="p-3 rounded-xl bg-background/50 border border-white/5 space-y-2">
                    <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground">
                       <div className="h-1 w-1 rounded-full bg-primary"></div>
                       Force Restricted Mode
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground">
                       <div className="h-1 w-1 rounded-full bg-primary"></div>
                       Bypass VPN Search Redirects
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* System Persistence */}
           <Card className={`border-none transition-all duration-500 flex flex-col ${settings.tamperProtection ? 'bg-primary/5 ring-1 ring-primary/30' : 'bg-secondary/30 ring-1 ring-white/10'}`}>
             <CardHeader className="pb-4">
               <div className="flex items-center justify-between">
                 <div className={`p-3 rounded-2xl transition-colors duration-500 ${settings.tamperProtection ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                   <Lock className="h-6 w-6" />
                 </div>
                 <Switch 
                   checked={settings.tamperProtection}
                   onCheckedChange={() => toggleSetting('tamperProtection')}
                 />
               </div>
               <CardTitle className="text-xl mt-4">System Persistence</CardTitle>
               <CardDescription className="text-xs">
                 Prevents disabling core protection components.
               </CardDescription>
             </CardHeader>
             <CardContent>
                {settings.tamperProtection ? (
                  <div className="space-y-2 ml-2 border-l border-primary/20 pl-4 py-1">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-background/40 transition-colors">
                       <Label className="text-[10px] font-bold uppercase tracking-wider">Accessibility</Label>
                       <Switch checked={settings.lockAccessibility} onCheckedChange={() => toggleSetting('lockAccessibility')} className="scale-75" />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-background/40 transition-colors">
                       <Label className="text-[10px] font-bold uppercase tracking-wider">Settings</Label>
                       <Switch checked={settings.blockSystemSettings} onCheckedChange={() => toggleSetting('blockSystemSettings')} className="scale-75" />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-background/40 transition-colors">
                       <Label className="text-[10px] font-bold uppercase tracking-wider">Device Admin</Label>
                       <Switch checked={settings.preventUninstall} onCheckedChange={() => toggleSetting('preventUninstall')} className="scale-75" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-center opacity-50 grayscale">
                     <ShieldAlert className="h-8 w-8 text-muted-foreground" />
                     <p className="text-[10px] font-medium">Persistence Disabled</p>
                  </div>
                )}
             </CardContent>
           </Card>
        </div>

        {/* Column 2: Uninstall Protection */}
        <div className="space-y-8">
           <Card className={`h-full border-none transition-all duration-500 flex flex-col ${settings.globalUninstallBlock ? 'bg-destructive/5 ring-1 ring-destructive/30' : 'bg-secondary/30 ring-1 ring-white/10'}`}>
             <CardHeader className="pb-4">
               <div className="flex items-center justify-between">
                 <div className={`p-3 rounded-2xl transition-colors duration-500 ${settings.globalUninstallBlock ? 'bg-destructive text-white shadow-lg shadow-destructive/20' : 'bg-muted text-muted-foreground'}`}>
                   <ShieldAlert className="h-6 w-6" />
                 </div>
                 <Switch 
                   checked={settings.globalUninstallBlock}
                   onCheckedChange={() => toggleSetting('globalUninstallBlock')}
                 />
               </div>
               <CardTitle className="text-xl mt-4">Global Uninstall Block</CardTitle>
               <CardDescription className="text-xs">
                 Completely disable app removals across the entire device.
               </CardDescription>
             </CardHeader>
             <CardContent className="flex-1">
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                   <p className="text-[10px] text-destructive font-bold uppercase tracking-tighter leading-relaxed">
                     NOTICE: This policy overrides all app-level settings and prevents any removal.
                   </p>
                </div>
             </CardContent>
             <CardFooter className="pt-0">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                   <ShieldCheck className="h-3 w-3 text-success" />
                   Enterprise Device Policy Active
                </div>
             </CardFooter>
           </Card>
        </div>

        {/* Column 3: Targeted App Protection */}
        <div className="space-y-8 h-full">
           <Card className="h-full border-none bg-secondary/30 backdrop-blur-md shadow-2xl shadow-black/5 ring-1 ring-white/10 flex flex-col">
              <CardHeader>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-4">
                  <Smartphone className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Targeted Protection</CardTitle>
                <CardDescription className="text-xs">
                  Lock specific apps from uninstallation.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="package.name"
                      className="flex-1 bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      value={newApp}
                      onChange={(e) => setNewApp(e.target.value)}
                    />
                    <button 
                      onClick={addApp}
                      className="bg-primary text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-primary/80 transition-all active:scale-95"
                    >
                      ADD
                    </button>
                 </div>

                 <div className="space-y-2">
                    <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Protected Apps</h4>
                    <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                       {protectedApps.map(app => (
                         <div key={app} className="flex items-center justify-between p-2.5 rounded-xl bg-background/40 border border-white/5 group hover:border-primary/20 transition-all">
                            <span className="text-[10px] font-medium font-mono truncate max-w-[150px]">{app}</span>
                            <button 
                              onClick={() => removeApp(app)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            >
                               <ShieldAlert className="h-3.5 w-3.5" />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="bg-primary/5 border-t border-primary/10 py-3">
                 <p className="text-[9px] text-muted-foreground italic">
                    Self-Shield is auto-protected.
                 </p>
              </CardFooter>
           </Card>
        </div>
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
