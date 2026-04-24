import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase';
import { asyncHandler, sendSuccess, sendError } from '../../utils/helpers';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

/**
 * GET /auth/me
 * Returns the current authenticated user's profile.
 */
router.get(
  '/me',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, role, display_name, email, created_at')
      .eq('id', req.userId!)
      .single();

    if (error || !user) {
      sendError(res, 'NOT_FOUND', 'User profile not found', 404);
      return;
    }

    sendSuccess(res, user);
  })
);

export default router;
