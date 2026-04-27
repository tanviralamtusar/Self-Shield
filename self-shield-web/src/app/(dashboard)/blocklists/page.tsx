import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BlocklistTable } from '@/components/blocklists/BlocklistTable';

export default function BlocklistsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blocklists</h2>
          <p className="text-muted-foreground mt-1">
            Manage system categories and your custom blocklists.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blocklists</CardTitle>
          <CardDescription>Manage both system categories and your custom lists here.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlocklistTable />
        </CardContent>
      </Card>
    </div>
  );
}
