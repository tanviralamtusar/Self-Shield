import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// DELETE /api/blocklists/[id]/entries/[eid]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; eid: string }> }
) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { id, eid } = await params;

  // Verify ownership of the blocklist implicitly via RLS or explicit check
  // Since we use admin client, we must do an explicit check
  const { data: list } = await supabaseAdmin
    .from('block_lists')
    .select('id')
    .eq('id', id)
    .eq('owner_id', auth.userId)
    .single();

  if (!list) return apiError('NOT_FOUND', 'Block list not found', 404);

  const { error } = await supabaseAdmin
    .from('block_list_entries')
    .delete()
    .eq('id', eid)
    .eq('block_list_id', id);

  if (error) return apiError('DB_ERROR', 'Failed to delete entry', 500);
  return apiSuccess({ deleted: true });
}
