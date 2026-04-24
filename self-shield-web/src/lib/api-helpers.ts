import { NextResponse } from 'next/server';

/**
 * Standard API response shape: { success, data, error }
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data, error: null }, { status });
}

export function apiError(code: string, message: string, status = 400) {
  return NextResponse.json(
    { success: false, data: null, error: { code, message } },
    { status }
  );
}

/**
 * Extract and validate user from Supabase auth in a route handler.
 * Returns userId or an error NextResponse.
 */
export async function requireAuth(
  supabaseAdmin: any,
  request: Request
): Promise<{ userId: string; role: string } | NextResponse> {
  const auth = request.headers.get('authorization');

  if (!auth?.startsWith('Bearer ')) {
    return apiError('UNAUTHORIZED', 'Missing Authorization header', 401);
  }

  const token = auth.substring(7);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return apiError('UNAUTHORIZED', 'Invalid or expired token', 401);
  }

  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return { userId: user.id, role: profile?.role || 'child' };
}

/** Type guard: checks if requireAuth returned an error response */
export function isAuthError(result: any): result is NextResponse {
  return result instanceof NextResponse;
}
