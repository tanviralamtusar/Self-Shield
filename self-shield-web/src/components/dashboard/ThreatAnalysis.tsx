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
    <Card className="h-full border border-border/50 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          Threat Intelligence
        </CardTitle>
        <CardDescription className="text-[11px]">Real-time monitoring of intercepted security events.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative aspect-video rounded-xl bg-muted/20 border border-border/50 flex items-center justify-center overflow-hidden">
          <Globe className="w-10 h-10 text-muted-foreground/20" />
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Scanning Blocklists
            </div>
          </div>
          <p className="absolute bottom-4 right-4 text-[9px] text-muted-foreground/40 font-mono tracking-widest uppercase">Encryption Active</p>
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
