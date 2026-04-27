'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOverrideRequests, useResolveOverride } from '@/hooks/useOverrideRequests';
import { Clock, CheckCircle2, XCircle, AlertCircle, Smartphone } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

export default function OverridesPage() {
  const { data: requests, isLoading } = useOverrideRequests();
  const resolveOverride = useResolveOverride();

  const handleResolve = async (id: string, status: 'approved' | 'denied') => {
    try {
      // In a real app, we'd get the admin ID from the session
      await resolveOverride.mutateAsync({ id, status, adminId: 'current-admin' });
      toast.success(`Request ${status}`);
    } catch (error: any) {
      toast.error(`Failed to ${status} request`, { description: error.message });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading requests...</div>;
  }

  const pending = requests?.filter(r => r.status === 'pending') || [];
  const history = requests?.filter(r => r.status !== 'pending') || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Emergency Access</h2>
        <p className="text-muted-foreground mt-1">
          Review and approve temporary block overrides requested by devices.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Pending Requests */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            <h3 className="text-xl font-semibold">Pending Requests</h3>
            <Badge variant="secondary" className="ml-2">{pending.length}</Badge>
          </div>

          {pending.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="py-10 text-center text-muted-foreground">
                No pending override requests.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pending.map((req) => (
                <Card key={req.id} className="border-warning/30 bg-warning/5">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{req.devices.device_name}</span>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        Pending
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{req.duration_min} Minutes Override</CardTitle>
                    <CardDescription>{format(parseISO(req.created_at), 'MMM d, h:mm a')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-background rounded-lg border text-sm">
                      <p className="text-muted-foreground mb-1 uppercase text-[10px] font-bold tracking-wider">Reason</p>
                      <p className="italic">"{req.reason || 'No reason provided'}"</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-success hover:bg-success/90" 
                        onClick={() => handleResolve(req.id, 'approved')}
                        disabled={resolveOverride.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        className="flex-1" 
                        variant="destructive" 
                        onClick={() => handleResolve(req.id, 'denied')}
                        disabled={resolveOverride.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Deny
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Recent History</h3>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-4 font-medium">Device</th>
                    <th className="text-left p-4 font-medium">Duration</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Resolved At</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {history.map((req) => (
                    <tr key={req.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">{req.devices.device_name}</td>
                      <td className="p-4 font-medium">{req.duration_min}m</td>
                      <td className="p-4">
                        <Badge variant={req.status === 'approved' ? 'default' : 'destructive'} className="capitalize">
                          {req.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {format(parseISO(req.created_at), 'MMM d, h:mm a')}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {req.resolved_at ? format(parseISO(req.resolved_at), 'h:mm a') : '-'}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                        No historical requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
