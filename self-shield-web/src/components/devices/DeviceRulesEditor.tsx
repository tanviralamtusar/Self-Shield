'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, AlertCircle, Loader2, Plus, Trash2, Shield, Layout, Clock, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useDeviceSettings, useUpdateDeviceSettings } from '@/hooks/useDeviceSettings';
import { useAppRules, useUpdateAppRule } from '@/hooks/useAppRules';
import { useBlockLists, useDeviceSubscriptions, useToggleSubscription } from '@/hooks/useBlockLists';
import { ScheduleEditor } from './ScheduleEditor';
import { KeywordManager } from './KeywordManager';


export function DeviceRulesEditor({ deviceId }: { deviceId: string }) {
  const { data: settings, isLoading: settingsLoading } = useDeviceSettings(deviceId);
  const updateSettings = useUpdateDeviceSettings();
  
  const { data: appRules, isLoading: appsLoading } = useAppRules(deviceId);
  const updateAppRule = useUpdateAppRule();
  
  const { data: allBlockLists, isLoading: listsLoading } = useBlockLists();
  const { data: subscriptions, isLoading: subsLoading } = useDeviceSubscriptions(deviceId);
  const toggleSubscription = useToggleSubscription();

  const handleGlobalToggle = async (key: string, value: boolean) => {
    try {
      await updateSettings.mutateAsync({ device_id: deviceId, [key]: value });
      toast.success('Setting updated');
    } catch (error: any) {
      toast.error('Failed to update setting', { description: error.message });
    }
  };

  const handleAppToggle = async (ruleId: string, key: string, value: boolean) => {
    try {
      await updateAppRule.mutateAsync({ id: ruleId, [key]: value });
      toast.success('App rule updated');
    } catch (error: any) {
      toast.error('Failed to update app rule', { description: error.message });
    }
  };

  const handleListToggle = async (listId: string, enabled: boolean) => {
    try {
      await toggleSubscription.mutateAsync({ deviceId, blockListId: listId, enabled });
      toast.success('Blocklist subscription updated');
    } catch (error: any) {
      toast.error('Failed to update subscription', { description: error.message });
    }
  };

  if (settingsLoading || appsLoading || listsLoading || subsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading device configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
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
              checked={settings?.vpn_enabled ?? true} 
              onCheckedChange={(checked) => handleGlobalToggle('vpn_enabled', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="accessibility_enabled">Accessibility UI Blocking</Label>
              <span className="text-sm text-muted-foreground">Monitors screen elements to block Reels, Shorts, etc.</span>
            </div>
            <Switch 
              id="accessibility_enabled" 
              checked={settings?.accessibility_enabled ?? true} 
              onCheckedChange={(checked) => handleGlobalToggle('accessibility_enabled', checked)} 
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="keyword_blocking">Keyword Interception</Label>
              <span className="text-sm text-muted-foreground">Blocks typing harmful keywords globally.</span>
            </div>
            <Switch 
              id="keyword_blocking" 
              checked={settings?.keyword_blocking ?? true} 
              onCheckedChange={(checked) => handleGlobalToggle('keyword_blocking', checked)} 
            />
          </div>
        </CardContent>
      </Card>

      <KeywordManager deviceId={deviceId} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Blocklists</CardTitle>
                <CardDescription>Managed hostname and keyword lists.</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add List
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {allBlockLists
              ?.filter(list => list.name !== 'My Custom Keywords' || list.is_default)
              .map((list) => {
              const sub = subscriptions?.find(s => s.block_list_id === list.id);
              return (
                <div key={list.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${list.type === 'hostname' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {list.type === 'hostname' ? <Globe className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{list.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{list.category} • {list.type}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={sub?.is_enabled ?? false} 
                    onCheckedChange={(checked) => handleListToggle(list.id, checked)}
                  />
                </div>
              );
            })}
            {(!allBlockLists || allBlockLists.length === 0) && (
              <div className="text-center py-6 text-muted-foreground italic text-sm">
                No blocklists found.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App-Specific Rules</CardTitle>
            <CardDescription>Fine-grained control over social feeds and time limits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {appRules?.map((rule) => (
              <div key={rule.id} className="space-y-4 p-4 border rounded-xl bg-muted/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {rule.app_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-semibold">{rule.app_name || rule.package_name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{rule.package_name}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={rule.is_blocked} 
                    onCheckedChange={(checked) => handleAppToggle(rule.id, 'is_blocked', checked)}
                  />
                </div>
                
                {!rule.is_blocked && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t mt-2">
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <Label htmlFor={`reels-${rule.id}`} className="text-xs cursor-pointer">Block Reels</Label>
                      <Switch 
                        id={`reels-${rule.id}`}
                        size="sm"
                        checked={rule.inapp_block_reels} 
                        onCheckedChange={(checked) => handleAppToggle(rule.id, 'inapp_block_reels', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <Label htmlFor={`shorts-${rule.id}`} className="text-xs cursor-pointer">Block Shorts</Label>
                      <Switch 
                        id={`shorts-${rule.id}`}
                        size="sm"
                        checked={rule.inapp_block_shorts} 
                        onCheckedChange={(checked) => handleAppToggle(rule.id, 'inapp_block_shorts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <Label htmlFor={`feed-${rule.id}`} className="text-xs cursor-pointer">Block Feed</Label>
                      <Switch 
                        id={`feed-${rule.id}`}
                        size="sm"
                        checked={rule.inapp_block_feed} 
                        onCheckedChange={(checked) => handleAppToggle(rule.id, 'inapp_block_feed', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <Label htmlFor={`schedule-${rule.id}`} className="text-xs cursor-pointer">Schedule</Label>
                      <Switch 
                        id={`schedule-${rule.id}`}
                        size="sm"
                        checked={rule.schedule_enabled} 
                        onCheckedChange={(checked) => handleAppToggle(rule.id, 'schedule_enabled', checked)} 
                      />
                    </div>
                  </div>
                )}

                {rule.schedule_enabled && !rule.is_blocked && (
                  <div className="pt-2">
                    <ScheduleEditor 
                      appRuleId={rule.id} 
                      appName={rule.app_name || rule.package_name} 
                      trigger={
                        <Button variant="outline" size="sm" className="w-full text-xs h-8">
                          <Clock className="w-3.5 h-3.5 mr-2" />
                          Configure Block Windows
                        </Button>
                      }
                    />
                  </div>
                )}
              </div>
            ))}
            {(!appRules || appRules.length === 0) && (
              <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
                <Layout className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No apps registered yet.</p>
                <p className="text-xs">Apps appear here once tracked on the device.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

