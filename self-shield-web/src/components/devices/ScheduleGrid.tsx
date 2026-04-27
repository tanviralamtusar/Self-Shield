import { useMemo } from 'react';
import type { AppSchedule } from '@/hooks/useAppSchedules';
import { cn } from '@/lib/utils';

interface ScheduleGridProps {
  schedules: AppSchedule[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function ScheduleGrid({ schedules }: ScheduleGridProps) {
  // Create a 7x24 map of blocked hours
  const grid = useMemo(() => {
    const map = Array.from({ length: 7 }, () => Array(24).fill(false));
    
    schedules.forEach(schedule => {
      const startHour = parseInt(schedule.start_time.split(':')[0]);
      const endHour = parseInt(schedule.end_time.split(':')[0]);
      
      schedule.day_of_week.forEach(day => {
        // Simple hour-based blocking for the grid
        for (let h = startHour; h <= endHour; h++) {
          if (h < 24) map[day][h] = true;
        }
      });
    });
    
    return map;
  }, [schedules]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Visual Schedule</h4>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" /> Blocked
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full border bg-background" /> Allowed
          </div>
        </div>
      </div>

      <div className="border rounded-xl bg-muted/20 p-4 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header (Hours) */}
          <div className="grid grid-cols-[50px_repeat(24,1fr)] mb-2">
            <div />
            {HOURS.map(h => (
              <div key={h} className="text-[9px] text-center text-muted-foreground font-mono">
                {h % 6 === 0 ? `${h}h` : ''}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="space-y-1.5">
            {DAYS.map((day, dIdx) => (
              <div key={day} className="grid grid-cols-[50px_repeat(24,1fr)] items-center group">
                <div className="text-[10px] font-medium text-muted-foreground">{day}</div>
                <div className="flex gap-0.5 h-6">
                  {HOURS.map(h => (
                    <div
                      key={h}
                      className={cn(
                        "flex-1 rounded-sm border transition-colors",
                        grid[dIdx][h] 
                          ? "bg-primary border-primary/50 shadow-[0_0_8px_rgba(var(--primary-rgb),0.2)]" 
                          : "bg-background/50 border-transparent hover:border-muted-foreground/20"
                      )}
                      title={`${day}, ${h}:00 - ${h+1}:00`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
