import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// POST /api/blocklists/[id]/entries — add entries in bulk
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { id } = await params;
  const { entries } = await request.json();

  if (!entries?.length) return apiError('VALIDATION_ERROR', 'entries array required', 422);

  // Verify ownership
  const { data: list } = await supabaseAdmin
    .from('block_lists').select('id').eq('id', id).eq('owner_id', auth.userId).single();
  if (!list) return apiError('NOT_FOUND', 'Block list not found', 404);

  const rows = entries.map((e: { value: string; is_regex?: boolean }) => ({
    block_list_id: id, value: e.value, is_regex: e.is_regex || false,
  }));

  const { data, error } = await supabaseAdmin.from('block_list_entries').insert(rows).select();
  if (error) return apiError('DB_ERROR', 'Failed to add entries', 500);
  return apiSuccess(data, 201);
}
