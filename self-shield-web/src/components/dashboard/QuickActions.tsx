import { Button } from '@/components/ui/button';
import { Smartphone, Lock, ShieldCheck, FileDown, Zap } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button nativeButton={false} variant="outline" className="h-16 flex-col gap-1 bg-muted/20 hover:bg-primary/5 transition-all" render={<Link href="/devices" />}>
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-medium">Pair</span>
      </Button>

      <Button nativeButton={false} variant="outline" className="h-16 flex-col gap-1 bg-muted/20 hover:bg-warning/5 transition-all" render={<Link href="/overrides" />}>
        <Lock className="w-4 h-4 text-warning" />
        <span className="text-[10px] font-medium">Review</span>
      </Button>

      <Button nativeButton={false} variant="outline" className="h-16 flex-col gap-1 bg-muted/20 hover:bg-success/5 transition-all" render={<Link href="/audit" />}>
        <ShieldCheck className="w-4 h-4 text-success" />
        <span className="text-[10px] font-medium">Logs</span>
      </Button>

      <Button nativeButton={false} variant="outline" className="h-16 flex-col gap-1 bg-muted/20 hover:bg-info/5 transition-all" render={<Link href="/reports" />}>
        <FileDown className="w-4 h-4 text-info" />
        <span className="text-[10px] font-medium">Report</span>
      </Button>
    </div>
  );
}
