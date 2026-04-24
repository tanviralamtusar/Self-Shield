import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

export async function GET(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, role, display_name, email, created_at')
    .eq('id', auth.userId)
    .single();

  if (error || !user) return apiError('NOT_FOUND', 'User profile not found', 404);
  return apiSuccess(user);
}
