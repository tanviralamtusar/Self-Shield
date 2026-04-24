import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// PATCH /api/blocklists/[id] — update a block list
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from('block_lists')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('owner_id', auth.userId)
    .select()
    .single();

  if (error || !data) return apiError('NOT_FOUND', 'Block list not found', 404);
  return apiSuccess(data);
}

// DELETE /api/blocklists/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { id } = await params;
  const { error } = await supabaseAdmin
    .from('block_lists')
    .delete()
    .eq('id', id)
    .eq('owner_id', auth.userId);

  if (error) return apiError('DB_ERROR', 'Failed to delete', 500);
  return apiSuccess({ deleted: true });
}
