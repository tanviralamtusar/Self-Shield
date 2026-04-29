'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Search, Type, Globe, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DeviceSettingsProps {
  device: any;
}

export function DeviceSettings({ device }: DeviceSettingsProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const settings = device.settings || {
    vpn_enabled: true,
    safe_search_enabled: false,
    keyword_blocking: true,
    server_side_check_enabled: true,
  };

  const updateSetting = async (key: string, value: boolean) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('device_settings')
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq('device_id', device.id);

      if (error) throw error;
      
      toast.success('Setting updated', {
        description: `${key.replace(/_/g, ' ')} has been ${value ? 'enabled' : 'disabled'}.`
      });
      
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    } catch (error: any) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting', { description: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core Protection</CardTitle>
          <CardDescription>
            Main switches to control the shielding features on this {device.device_type === 'browser_extension' ? 'extension' : 'device'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-semibold">Shield Protection</Label>
                <p className="text-sm text-muted-foreground">
                  Master switch for all content blocking features.
                </p>
              </div>
            </div>
            <Switch 
              checked={settings.vpn_enabled}
              onCheckedChange={(checked) => updateSetting('vpn_enabled', checked)}
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Type className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-semibold">Keyword Blocking</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent pages from loading if they contain restricted keywords.
                </p>
              </div>
            </div>
            <Switch 
              checked={settings.keyword_blocking}
              onCheckedChange={(checked) => updateSetting('keyword_blocking', checked)}
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-semibold">Safe Search Enforcement</Label>
                <p className="text-sm text-muted-foreground">
                  Force Google, Bing, and DuckDuckGo to use strict filtering.
                </p>
              </div>
            </div>
            <Switch 
              checked={settings.safe_search_enabled}
              onCheckedChange={(checked) => updateSetting('safe_search_enabled', checked)}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Protection</CardTitle>
          <CardDescription>
            Configuration for real-time cloud-based protection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-semibold">Server-Side URL Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Check URLs against our global database in real-time.
                </p>
              </div>
            </div>
            <Switch 
              checked={settings.server_side_check_enabled}
              onCheckedChange={(checked) => updateSetting('server_side_check_enabled', checked)}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
