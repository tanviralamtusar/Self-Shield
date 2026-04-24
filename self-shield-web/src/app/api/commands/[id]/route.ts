import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// PATCH /api/commands/[id] — device marks command executed/failed
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const { status } = await request.json();

  if (!['executed', 'failed'].includes(status)) {
    return apiError('VALIDATION_ERROR', 'status must be executed or failed', 422);
  }

  const { data, error } = await supabaseAdmin
    .from('remote_commands')
    .update({ status, executed_at: new Date().toISOString() })
    .eq('id', id).select().single();

  if (error || !data) return apiError('NOT_FOUND', 'Command not found', 404);
  return apiSuccess(data);
}
