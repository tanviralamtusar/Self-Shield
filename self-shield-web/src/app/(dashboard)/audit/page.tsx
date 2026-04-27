import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLogTable } from '@/components/audit/AuditLogTable';

export default function AuditPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Audit Log</h2>
        <p className="text-muted-foreground mt-1">
          Review security events, tamper attempts, and blocking activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>A chronological log of all important device events.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuditLogTable />
        </CardContent>
      </Card>
    </div>
  );
}
