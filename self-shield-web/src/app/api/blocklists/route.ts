import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// GET /api/blocklists — list all visible block lists
export async function GET(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;

  const { data, error } = await supabaseAdmin
    .from('block_lists')
    .select('*')
    .or(`owner_id.eq.${auth.userId},is_public.eq.true`)
    .order('created_at', { ascending: false });

  if (error) return apiError('DB_ERROR', 'Failed to fetch block lists', 500);
  return apiSuccess(data);
}

// POST /api/blocklists — create custom block list
export async function POST(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { name, type, category } = await request.json();
  if (!name || !type) return apiError('VALIDATION_ERROR', 'name and type required', 422);

  const { data, error } = await supabaseAdmin
    .from('block_lists')
    .insert({ owner_id: auth.userId, name, type, category: category || 'custom' })
    .select()
    .single();

  if (error) return apiError('DB_ERROR', 'Failed to create block list', 500);
  return apiSuccess(data, 201);
}
