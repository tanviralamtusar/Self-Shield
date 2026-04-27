import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, ArrowRight, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WeeklyReportPreview() {
  return (
    <Card className="overflow-hidden border-primary/20 bg-primary/5">
      <CardHeader className="bg-primary/10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <CardTitle>Weekly Summary Preview</CardTitle>
          </div>
          <Button size="xs" variant="outline" className="bg-background">
            <Download className="w-3 h-3 mr-1" /> PDF
          </Button>
        </div>
        <CardDescription>This is how your automated weekly report looks.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-background rounded-xl border shadow-sm p-6 space-y-6 max-w-md mx-auto text-center">
          <div className="space-y-1">
            <h4 className="text-xl font-bold">Self-Shield Report</h4>
            <p className="text-xs text-muted-foreground">Apr 20 - Apr 26, 2026</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Screen Time</p>
              <p className="text-lg font-bold">14h 22m</p>
              <p className="text-[10px] text-success font-medium">↓ 12% from last week</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Blocks</p>
              <p className="text-lg font-bold">1,240</p>
              <p className="text-[10px] text-warning font-medium">↑ 5% from last week</p>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="text-xs font-bold uppercase tracking-tight">Top Distractions</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Instagram (Reels)</span>
                <span className="font-medium">4h 10m</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span>YouTube (Shorts)</span>
                <span className="font-medium">2h 45m</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground italic mb-4">
              "Focus is the art of saying no to distractions."
            </p>
            <Button className="w-full text-xs h-8">
              View Full Dashboard <ArrowRight className="ml-2 w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button variant="ghost" size="sm" className="text-xs">
            <Share2 className="w-3 h-3 mr-2" /> Share with Accountability Partner
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
