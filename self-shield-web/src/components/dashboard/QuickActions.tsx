import { Button } from '@/components/ui/button';
import { Smartphone, Lock, ShieldCheck, FileDown, Zap } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      <Button nativeButton={false} variant="outline" size="sm" className="gap-2 bg-card/30 border-border/50 hover:bg-primary/5 transition-all" render={<Link href="/devices" />}>
        <Zap className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium">Pair Device</span>
      </Button>

      <Button nativeButton={false} variant="outline" size="sm" className="gap-2 bg-card/30 border-border/50 hover:bg-amber-500/5 transition-all" render={<Link href="/overrides" />}>
        <Lock className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-xs font-medium">Review</span>
      </Button>

      <Button nativeButton={false} variant="outline" size="sm" className="gap-2 bg-card/30 border-border/50 hover:bg-emerald-500/5 transition-all" render={<Link href="/audit" />}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-xs font-medium">Logs</span>
      </Button>
    </div>
  );
}
