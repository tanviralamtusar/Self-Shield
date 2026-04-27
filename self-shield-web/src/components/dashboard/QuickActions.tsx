import { Button } from '@/components/ui/button';
import { Smartphone, Lock, ShieldCheck, FileDown, Zap } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button variant="outline" className="h-20 flex-col gap-2 bg-background/50 hover:bg-primary/5 hover:border-primary/50 transition-all border-dashed" render={<Link href="/devices" />}>
        <Zap className="w-5 h-5 text-primary" />
        <span className="text-xs">Pair Device</span>
      </Button>

      <Button variant="outline" className="h-20 flex-col gap-2 bg-background/50 hover:bg-warning/5 hover:border-warning/50 transition-all border-dashed" render={<Link href="/overrides" />}>
        <Lock className="w-5 h-5 text-warning" />
        <span className="text-xs">Review Requests</span>
      </Button>

      <Button variant="outline" className="h-20 flex-col gap-2 bg-background/50 hover:bg-success/5 hover:border-success/50 transition-all border-dashed" render={<Link href="/audit" />}>
        <ShieldCheck className="w-5 h-5 text-success" />
        <span className="text-xs">Security Logs</span>
      </Button>

      <Button variant="outline" className="h-20 flex-col gap-2 bg-background/50 hover:bg-info/5 hover:border-info/50 transition-all border-dashed" render={<Link href="/reports" />}>
        <FileDown className="w-5 h-5 text-info" />
        <span className="text-xs">Export Report</span>
      </Button>
    </div>
  );
}
