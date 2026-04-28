'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, ShieldAlert, Search, Loader2, RefreshCw, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useActivityLog } from '@/hooks/useActivityLog';
import { formatDistanceToNow, format } from 'date-fns';

const EVENT_CONFIG: Record<string, { label: string; color: string; icon: typeof Globe }> = {
  site_visit: { label: 'Visit', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Globe },
  block_triggered: { label: 'Blocked', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: ShieldAlert },
  keyword_blocked: { label: 'Keyword', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: ShieldAlert },
  app_open: { label: 'App Open', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: Globe },
  app_close: { label: 'App Close', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: Globe },
  focus_start: { label: 'Focus', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Globe },
  focus_end: { label: 'Focus End', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Globe },
};

type FilterType = 'all' | 'site_visit' | 'block_triggered' | 'keyword_blocked';

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return remainMins > 0 ? `${hrs}h ${remainMins}m` : `${hrs}h`;
}

export function ActivityLog({ deviceId }: { deviceId: string }) {
  const { data: events, isLoading, refetch, isRefetching } = useActivityLog(deviceId);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'site_visit', label: 'Visits' },
    { value: 'block_triggered', label: 'Blocked' },
    { value: 'keyword_blocked', label: 'Keywords' },
  ];

  const filtered = events?.filter((e) => {
    if (filter !== 'all' && e.event_type !== filter) return false;
    if (search && e.target && !e.target.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) ?? [];

  // Group events by date
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, event) => {
    const dateKey = format(new Date(event.occurred_at), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading activity log...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by hostname..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="text-xs"
            >
              {f.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filtered.length} events</span>
        <span>•</span>
        <span>Last 3 days</span>
        {events && events.length > 0 && (
          <>
            <span>•</span>
            <span>{events.filter(e => e.event_type === 'block_triggered').length} blocked</span>
            <span>•</span>
            <span>
              {formatDuration(
                events
                  .filter(e => e.event_type === 'site_visit' && e.duration_sec)
                  .reduce((sum, e) => sum + (e.duration_sec || 0), 0)
              )} total browsing
            </span>
          </>
        )}
      </div>

      {/* Top Sites Summary */}
      {events && events.filter(e => e.event_type === 'site_visit' && e.duration_sec).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Top Sites by Time
            </CardTitle>
            <CardDescription>Aggregated browsing time per site</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {(() => {
                const siteTime: Record<string, number> = {};
                events
                  .filter(e => e.event_type === 'site_visit' && e.duration_sec)
                  .forEach(e => {
                    if (e.target) {
                      siteTime[e.target] = (siteTime[e.target] || 0) + (e.duration_sec || 0);
                    }
                  });
                const sorted = Object.entries(siteTime)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10);
                const maxTime = sorted[0]?.[1] || 1;

                return sorted.map(([hostname, totalSec]) => (
                  <div key={hostname} className="px-6 py-3 flex items-center gap-4">
                    <span className="text-sm font-mono text-foreground/80 truncate min-w-0 w-48 shrink-0">
                      {hostname}
                    </span>
                    <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500/60 rounded-full transition-all"
                        style={{ width: `${(totalSec / maxTime) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground tabular-nums shrink-0 w-16 text-right">
                      {formatDuration(totalSec)}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event list */}
      {dateKeys.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-muted-foreground">No activity recorded yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Site visits and blocked attempts will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        dateKeys.map((dateKey) => {
          const dayEvents = grouped[dateKey];
          const dateLabel = format(new Date(dateKey), 'EEEE, MMM d');
          const isToday = dateKey === format(new Date(), 'yyyy-MM-dd');

          return (
            <Card key={dateKey}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {isToday ? 'Today' : dateLabel}
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {dayEvents.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {dayEvents.map((event) => {
                    const config = EVENT_CONFIG[event.event_type] ?? {
                      label: event.event_type,
                      color: 'bg-muted text-muted-foreground border-border',
                      icon: Globe,
                    };

                    return (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 px-6 py-3 hover:bg-muted/30 transition-colors"
                      >
                        {/* Event type badge */}
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${config.color} shrink-0`}
                        >
                          {config.label}
                        </Badge>

                        {/* Target */}
                        <span className="text-sm font-mono text-foreground/80 truncate flex-1 min-w-0">
                          {event.target || '—'}
                        </span>

                        {/* Duration */}
                        {event.duration_sec && event.duration_sec > 0 ? (
                          <span className="text-xs font-mono text-blue-400/80 shrink-0 tabular-nums bg-blue-500/10 px-1.5 py-0.5 rounded">
                            {formatDuration(event.duration_sec)}
                          </span>
                        ) : null}

                        {/* Time */}
                        <span className="text-xs text-muted-foreground/60 shrink-0 tabular-nums">
                          {format(new Date(event.occurred_at), 'HH:mm:ss')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
