'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Type, Loader2 } from 'lucide-react';
import { 
  useBlockLists, 
  useBlockListEntries, 
  useAddEntry, 
  useDeleteEntry,
  useToggleSubscription,
  useDeviceSubscriptions
} from '@/hooks/useBlockLists';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface KeywordManagerProps {
  deviceId: string;
}

export function KeywordManager({ deviceId }: KeywordManagerProps) {
  const [newKeyword, setNewKeyword] = useState('');
  const [personalListId, setPersonalListId] = useState<string | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  
  const supabase = createClient();
  const { data: allLists, refetch: refetchLists } = useBlockLists();
  const { data: subscriptions } = useDeviceSubscriptions(deviceId);
  const { data: entries, isLoading: entriesLoading } = useBlockListEntries(personalListId || undefined);
  
  const addEntry = useAddEntry();
  const deleteEntry = useDeleteEntry();
  const toggleSubscription = useToggleSubscription();

  // Find or create "My Custom Keywords" list
  useEffect(() => {
    let isMounted = true;
    
    const initList = async () => {
      if (!allLists || !subscriptions || personalListId) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !isMounted) return;

        let myList = allLists.find(l => 
          l.name === 'My Custom Keywords' && 
          l.owner_id === user.id && 
          l.is_default === false
        );
        
        if (myList) {
          if (isMounted) setPersonalListId(myList.id);
          
          // Ensure device is subscribed
          const isSubscribed = subscriptions?.some(s => s.block_list_id === myList!.id && s.is_enabled);
          if (!isSubscribed) {
            await toggleSubscription.mutateAsync({ deviceId, blockListId: myList.id, enabled: true });
          }
        } else {
          // Create it
          if (isMounted) setIsCreatingList(true);
          
          const { data: newList, error } = await supabase
            .from('block_lists')
            .insert({
              name: 'My Custom Keywords',
              type: 'keyword',
              owner_id: user.id,
              is_default: false,
              category: 'custom'
            })
            .select()
            .single();

          if (error) throw error;
          
          if (isMounted) {
            setPersonalListId(newList.id);
            refetchLists();
            // Auto-subscribe device
            await toggleSubscription.mutateAsync({ deviceId, blockListId: newList.id, enabled: true });
          }
        }
      } catch (error: any) {
        if (isMounted && error.message !== 'Lock stolen') {
          console.error('Error initializing keyword list:', error);
          toast.error('Failed to initialize custom keywords');
        }
      } finally {
        if (isMounted) setIsCreatingList(false);
      }
    };

    initList();

    return () => {
      isMounted = false;
    };
  }, [deviceId, allLists?.length, subscriptions?.length, personalListId]);

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !personalListId) return;

    try {
      await addEntry.mutateAsync({
        blockListId: personalListId,
        value: newKeyword.trim().toLowerCase()
      });
      setNewKeyword('');
      toast.success('Keyword added');
    } catch (error: any) {
      toast.error('Failed to add keyword', { description: error.message });
    }
  };

  const handleDeleteKeyword = async (entryId: string) => {
    if (!personalListId) return;
    try {
      await deleteEntry.mutateAsync({ id: entryId, blockListId: personalListId });
      toast.success('Keyword removed');
    } catch (error: any) {
      toast.error('Failed to remove keyword');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" />
          Custom Keywords
        </CardTitle>
        <CardDescription>
          Add specific words or phrases that should trigger a block on this device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddKeyword} className="flex gap-2">
          <Input
            placeholder="Enter a keyword (e.g. gambling)"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            disabled={addEntry.isPending || isCreatingList}
          />
          <Button type="submit" disabled={addEntry.isPending || isCreatingList}>
            {addEntry.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span className="ml-2 hidden sm:inline">Add</span>
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg bg-muted/20">
          {entries?.map((entry) => (
            <Badge 
              key={entry.id} 
              variant="secondary" 
              className="pl-3 pr-1 py-1 gap-1 text-sm hover:bg-muted-foreground/10 transition-colors"
            >
              {entry.value}
              <button 
                onClick={() => handleDeleteKeyword(entry.id)}
                className="hover:text-destructive p-0.5 rounded-full hover:bg-destructive/10"
                disabled={deleteEntry.isPending}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {entriesLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          )}
          {!entriesLoading && (!entries || entries.length === 0) && (
            <p className="text-sm text-muted-foreground italic">No custom keywords added yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
