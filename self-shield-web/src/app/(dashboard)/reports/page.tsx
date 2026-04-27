import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        <p className="text-muted-foreground mt-1">
          View usage patterns and screen time across your devices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Screen Time Overview</CardTitle>
            <CardDescription>Daily usage across all devices.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <span className="text-muted-foreground">Charts will appear here.</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
