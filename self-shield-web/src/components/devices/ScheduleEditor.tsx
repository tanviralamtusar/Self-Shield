import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock, Plus, Trash2, Calendar } from 'lucide-react';
import { useAppSchedules, useUpsertAppSchedule, useDeleteAppSchedule } from '@/hooks/useAppSchedules';
import { toast } from 'sonner';

interface ScheduleEditorProps {
  appRuleId: string;
  appName: string;
  trigger?: React.ReactNode;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ScheduleEditor({ appRuleId, appName, trigger }: ScheduleEditorProps) {
  const { data: schedules, isLoading } = useAppSchedules(appRuleId);
  const upsertSchedule = useUpsertAppSchedule();
  const deleteSchedule = useDeleteAppSchedule();

  const [newSchedule, setNewSchedule] = useState({
    day_of_week: [] as number[],
    start_time: '09:00',
    end_time: '17:00',
  });

  const toggleDay = (dayIndex: number) => {
    setNewSchedule(prev => ({
      ...prev,
      day_of_week: prev.day_of_week.includes(dayIndex)
        ? prev.day_of_week.filter(d => d !== dayIndex)
        : [...prev.day_of_week, dayIndex]
    }));
  };

  const handleAdd = async () => {
    if (newSchedule.day_of_week.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    try {
      await upsertSchedule.mutateAsync({
        app_rule_id: appRuleId,
        ...newSchedule,
      });
      setNewSchedule({ day_of_week: [], start_time: '09:00', end_time: '17:00' });
      toast.success('Schedule added');
    } catch (error: any) {
      toast.error('Failed to add schedule', { description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule.mutateAsync({ id, appRuleId });
      toast.success('Schedule deleted');
    } catch (error: any) {
      toast.error('Failed to delete schedule', { description: error.message });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Manage Schedule
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Schedule: {appName}</SheetTitle>
          <SheetDescription>
            Set specific time windows when this app should be blocked.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 py-6">
          {/* Current Schedules */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Active Schedules</h4>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : schedules?.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No schedules defined yet.</p>
            ) : (
              <div className="space-y-3">
                {schedules?.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 text-sm">
                    <div>
                      <div className="flex gap-1 mb-1">
                        {schedule.day_of_week.map(d => (
                          <span key={d} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                            {DAYS[d]}
                          </span>
                        ))}
                      </div>
                      <p className="font-medium">{schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr />

          {/* Add New Schedule */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Add New Window</h4>
            
            <div className="space-y-3">
              <Label>Days of Week</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day, i) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(i)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                      newSchedule.day_of_week.includes(i)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-input hover:border-primary'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>
                <Input
                  id="start"
                  type="time"
                  value={newSchedule.start_time}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, start_time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Time</Label>
                <Input
                  id="end"
                  type="time"
                  value={newSchedule.end_time}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, end_time: e.target.value }))}
                />
              </div>
            </div>

            <Button className="w-full" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Time Window
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
