'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Globe, Lock, AlertTriangle } from 'lucide-react';

const recentThreats = [
  { id: 1, type: 'Domain Block', target: 'ads.doubleclick.net', source: 'Android-14', time: '2m ago', risk: 'Low' },
  { id: 2, type: 'Tamper Alert', target: 'System Settings', source: 'Pixel-8', time: '15m ago', risk: 'High' },
  { id: 3, type: 'PIN Reset', target: 'Admin Panel', source: 'Web Dashboard', time: '1h ago', risk: 'Medium' },
];

export function ThreatAnalysis() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-destructive" />
          Live Threat Analysis
        </CardTitle>
        <CardDescription>Real-time monitoring of intercepted security events.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative aspect-video rounded-xl bg-muted/30 border border-dashed flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] opacity-5 group-hover:opacity-10 transition-opacity" />
          <Globe className="w-12 h-12 text-muted-foreground/20" />
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Scanning Global Blocklists...
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-mono">ENCRYPTION ACTIVE: AES-256-GCM</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Mitigations</h4>
          <div className="space-y-3">
            {recentThreats.map(threat => (
              <div key={threat.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-transparent hover:border-border">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${
                    threat.risk === 'High' ? 'bg-destructive/10 text-destructive' : 
                    threat.risk === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                  }`}>
                    {threat.risk === 'High' ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{threat.target}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{threat.type} • {threat.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">{threat.time}</p>
                  <Badge variant="outline" className="h-4 text-[9px] px-1 py-0 mt-1">{threat.risk}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
