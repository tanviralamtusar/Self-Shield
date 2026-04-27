'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, Zap, Globe, Search, Lock } from 'lucide-react';
import { toast } from 'sonner';

export function StrictProtection() {
  const [isSafeSearchEnabled, setIsSafeSearchEnabled] = useState(false);
  const [isTamperProof, setIsTamperProof] = useState(true);

  const handleToggleSafeSearch = (checked: boolean) => {
    setIsSafeSearchEnabled(checked);
    if (checked) {
      toast.success('Universal SafeSearch Enabled', {
        description: 'Strict filtering is now active on all search engines.',
      });
    } else {
      toast.warning('SafeSearch Disabled', {
        description: 'Search results are no longer filtered.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Strict Protection
        </h2>
        <p className="text-muted-foreground text-lg">
          Enforce high-level security and filtering across all devices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Universal SafeSearch Card */}
        <Card className={`relative overflow-hidden border-2 transition-all duration-500 ${isSafeSearchEnabled ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'}`}>
          {isSafeSearchEnabled && (
            <div className="absolute top-0 right-0 p-4">
              <div className="animate-pulse flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-widest">
                <Zap className="h-3 w-3 fill-primary" />
                Active
              </div>
            </div>
          )}
          <CardHeader>
            <div className="p-3 rounded-2xl bg-primary/10 w-fit mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Universal SafeSearch</CardTitle>
            <CardDescription>
              Force strict filtering on Google, Bing, YouTube, and all major search engines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
              <div className="space-y-0.5">
                <Label className="text-base">Strict Mode</Label>
                <p className="text-sm text-muted-foreground">Force SafeSearch globally</p>
              </div>
              <Switch 
                checked={isSafeSearchEnabled}
                onCheckedChange={handleToggleSafeSearch}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Redirects all search queries to safe counterparts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Blocks adult images & videos in results</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t py-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              Works on all browsers & apps
            </div>
          </CardFooter>
        </Card>

        {/* Tamper Protection Card */}
        <Card className="border-2 border-border hover:border-primary/20 transition-all duration-300">
          <CardHeader>
            <div className="p-3 rounded-2xl bg-orange-500/10 w-fit mb-4">
              <Lock className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-2xl">Tamper Protection</CardTitle>
            <CardDescription>
              Prevent the user from disabling protection or changing settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
              <div className="space-y-0.5">
                <Label className="text-base">Force Enforce</Label>
                <p className="text-sm text-muted-foreground">Cannot be turned off locally</p>
              </div>
              <Switch 
                checked={isTamperProof}
                onCheckedChange={setIsTamperProof}
                disabled
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
            <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10">
              <p className="text-sm text-orange-600 dark:text-orange-400 flex gap-2 font-medium">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                Device Owner mode is active. This device is managed by Self-Shield and settings are locked.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl bg-primary p-8 text-primary-foreground relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4">
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-transparent">New Feature</Badge>
          <h3 className="text-2xl font-bold">One-Click Strict Mode</h3>
          <p className="text-primary-foreground/80 max-w-2xl text-lg leading-relaxed">
            By enabling Universal SafeSearch, you are activating a network-level policy that automatically modifies search engine traffic. This is more effective than DNS because it handles encrypted SNI and prevents local bypasses.
          </p>
          <div className="pt-4 flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Globe className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-medium opacity-70 uppercase tracking-tighter">Web</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Search className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-medium opacity-70 uppercase tracking-tighter">Search</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Lock className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-medium opacity-70 uppercase tracking-tighter">Secure</span>
            </div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
      </div>
    </div>
  );
}
