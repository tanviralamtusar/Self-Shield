'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDevices } from '@/hooks/useDevices';
import { useMasterLockdown } from '@/hooks/useMasterLockdown';
import { Settings, Shield, User, Bell, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data: devices } = useDevices();
  const masterLockdown = useMasterLockdown();

  const handleMasterLockdown = async () => {
    if (!confirm('Are you sure you want to lock ALL devices? This will prevent any access until manually unlocked from the dashboard.')) return;
    
    try {
      await masterLockdown.mutateAsync();
      toast.success('Lockdown commands sent to all devices');
    } catch (error: any) {
      toast.error('Failed to trigger lockdown', { description: error.message });
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Notification settings saved');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your account, notification preferences, and global security.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Admin Profile</CardTitle>
            </div>
            <CardDescription>Your personal administrative information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue="admin@self-shield.app" disabled />
                </div>
              </div>
              <Button type="submit">Update Profile</Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Choose how you want to be alerted about security events.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tamper Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a device reports a tamper attempt.</p>
                  </div>
                  <div className="flex gap-4">
                    <Label className="flex items-center gap-2">
                      <Input type="checkbox" className="w-4 h-4" defaultChecked /> Push
                    </Label>
                    <Label className="flex items-center gap-2">
                      <Input type="checkbox" className="w-4 h-4" defaultChecked /> Email
                    </Label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of digital discipline metrics.</p>
                  </div>
                  <Label className="flex items-center gap-2">
                    <Input type="checkbox" className="w-4 h-4" defaultChecked /> Email
                  </Label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base">Override Requests</Label>
                    <p className="text-sm text-muted-foreground">Immediate alerts for emergency access requests.</p>
                  </div>
                  <div className="flex gap-4">
                    <Label className="flex items-center gap-2">
                      <Input type="checkbox" className="w-4 h-4" defaultChecked /> Push
                    </Label>
                    <Label className="flex items-center gap-2">
                      <Input type="checkbox" className="w-4 h-4" /> Email
                    </Label>
                  </div>
                </div>
              </div>
              <Button type="submit">Save Preferences</Button>
            </form>
          </CardContent>
        </Card>

        {/* Global Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              <CardTitle>Global Security</CardTitle>
            </div>
            <CardDescription>Advanced security settings for all linked devices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
              <h4 className="font-semibold text-destructive mb-2">Master Lockdown</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Instantly lock all devices linked to this account. Useful for emergency situations.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleMasterLockdown}
                disabled={masterLockdown.isPending}
              >
                {masterLockdown.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Locking Down...
                  </>
                ) : (
                  'Lock All Devices'
                )}
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-semibold mb-2">Data Management</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Export all your data or request account deletion.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">Export All Data (JSON)</Button>
                <Button variant="outline" className="text-destructive hover:bg-destructive/10">Delete Account</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
