'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Bell, User, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function AccountSettings() {
  const [loading, setLoading] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings updated');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Manage your administrator account details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="admin@selfshield.com" disabled />
              <p className="text-xs text-muted-foreground">Email change requires verification.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t py-4">
          <Button onClick={handleUpdate} disabled={loading}>
            Save Profile Changes
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Choose how you want to be alerted of security events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive daily summaries and critical alerts via email.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tamper Notifications</Label>
              <p className="text-sm text-muted-foreground">Immediate alerts when a device attempts to bypass protection.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Override Requests</Label>
              <p className="text-sm text-muted-foreground">Get notified when a child requests a block bypass.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Update your security credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Key className="w-4 h-4 mr-2" />
            Change Admin Password
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10">
            <Lock className="w-4 h-4 mr-2" />
            Logout from all devices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Key({ className, ...props }: any) {
  return <Mail className={className} {...props} />
}
