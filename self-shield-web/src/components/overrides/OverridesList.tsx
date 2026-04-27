'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function OverridesList() {
  // Mock data for requests
  const requests = [
    { 
      id: '1', 
      device_name: 'Pixel 7', 
      type: 'Website', 
      target: 'wikipedia.org', 
      duration: '30m', 
      reason: 'Need for school project research',
      time: '2 mins ago'
    },
    { 
      id: '2', 
      device_name: 'Samsung S22', 
      type: 'App', 
      target: 'YouTube', 
      duration: '1h', 
      reason: 'Watching educational tutorial',
      time: '15 mins ago'
    }
  ];

  const handleAction = (id: string, action: 'approve' | 'deny') => {
    toast.success(`Request ${action === 'approve' ? 'approved' : 'denied'}`);
  };

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{request.type}</Badge>
                  <span className="font-semibold text-lg">{request.target}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {request.time}
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Device</p>
                  <p className="font-medium">{request.device_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Requested Duration</p>
                  <p className="font-medium">{request.duration}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-muted-foreground">Reason</p>
                  <p className="italic bg-muted/50 p-2 rounded mt-1 border">
                    "{request.reason}"
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 border-l p-4 flex flex-col justify-center gap-2 min-w-[160px]">
              <Button 
                className="w-full bg-success hover:bg-success/90" 
                onClick={() => handleAction(request.id, 'approve')}
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={() => handleAction(request.id, 'deny')}
              >
                <X className="w-4 h-4 mr-2" />
                Deny
              </Button>
              <Button variant="ghost" size="sm" className="w-full mt-2">
                <ExternalLink className="w-3 h-3 mr-2" />
                View History
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      {requests.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
          No pending override requests.
        </div>
      )}
    </div>
  );
}
