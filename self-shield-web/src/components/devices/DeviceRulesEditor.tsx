'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function DeviceRulesEditor({ deviceId }: { deviceId: string }) {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Mock state for form (would come from Supabase in a real app)
  const [settings, setSettings] = useState({
    vpn_enabled: true,
    accessibility_enabled: true,
    keyword_blocking: true,
    inapp_blocking: true,
    theme: 'system',
    biometric_enabled: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call to PATCH /devices/:id/settings
    setTimeout(() => {
      setSaving(false);
      setHasChanges(false);
      toast.success('Rules updated successfully', {
        description: 'Changes will sync to the device within a few minutes.',
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Protections</CardTitle>
          <CardDescription>Master switches for core features on this device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="vpn_enabled">VPN Blocking Engine</Label>
              <span className="text-sm text-muted-foreground">Routes traffic locally to block websites.</span>
            </div>
            <Switch 
              id="vpn_enabled" 
              checked={settings.vpn_enabled} 
              onCheckedChange={() => handleToggle('vpn_enabled')} 
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="accessibility_enabled">Accessibility UI Blocking</Label>
              <span className="text-sm text-muted-foreground">Monitors screen elements to block Reels, Shorts, etc.</span>
            </div>
            <Switch 
              id="accessibility_enabled" 
              checked={settings.accessibility_enabled} 
              onCheckedChange={() => handleToggle('accessibility_enabled')} 
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="keyword_blocking">Keyword Interception</Label>
              <span className="text-sm text-muted-foreground">Blocks typing harmful keywords globally.</span>
            </div>
            <Switch 
              id="keyword_blocking" 
              checked={settings.keyword_blocking} 
              onCheckedChange={() => handleToggle('keyword_blocking')} 
            />
          </div>
        </CardContent>
        {hasChanges && (
          <CardFooter className="bg-muted/50 border-t py-3 flex justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 mr-2" />
              Unsaved changes
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
              <Save className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Blocklists</CardTitle>
            <CardDescription>Manage which lists are applied.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground">
              List management coming soon.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App-Specific Rules</CardTitle>
            <CardDescription>Manage protections per application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground">
              App list loading...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
