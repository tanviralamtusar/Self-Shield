import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Categories</CardTitle>
            <CardDescription>Curated lists maintained by Self-Shield.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* List items will go here */}
            <p className="text-sm text-muted-foreground">Loading categories...</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Custom Lists</CardTitle>
            <CardDescription>Your personal blocked websites and keywords.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No custom lists found.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
