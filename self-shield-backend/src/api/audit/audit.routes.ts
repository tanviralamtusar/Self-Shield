import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../config/supabase';
import { asyncHandler, sendSuccess, sendError } from '../../utils/helpers';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';

const router = Router();
router.use(authMiddleware);

const batchAuditSchema = z.object({
  device_id: z.string().uuid(),
  events: z.array(z.object({
    event_type: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
    screenshot_url: z.string().optional(),
    occurred_at: z.string(),
  })),
});

router.post('/', validate(batchAuditSchema), asyncHandler(async (req: Request, res: Response) => {
  const events = req.body.events.map((e: Record<string, unknown>) => ({
    ...e, device_id: req.body.device_id,
  }));
  const { error } = await supabaseAdmin.from('audit_log').insert(events);
  if (error) { sendError(res, 'DB_ERROR', 'Failed to insert audit events', 500); return; }
  sendSuccess(res, { inserted: events.length }, 201);
}));

router.get('/:deviceId', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;
  let query = supabaseAdmin.from('audit_log').select('*').eq('device_id', req.params.deviceId);
  if (req.query.type) query = query.eq('event_type', req.query.type as string);
  const { data, error } = await query.order('occurred_at', { ascending: false }).range(offset, offset + limit - 1);
  if (error) { sendError(res, 'DB_ERROR', 'Failed to fetch audit log', 500); return; }
  sendSuccess(res, data);
}));

router.get('/:deviceId/screenshots', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('audit_log')
    .select('id, event_type, screenshot_url, occurred_at')
    .eq('device_id', req.params.deviceId).not('screenshot_url', 'is', null)
    .order('occurred_at', { ascending: false }).limit(50);
  if (error) { sendError(res, 'DB_ERROR', 'Failed to fetch screenshots', 500); return; }
  sendSuccess(res, data);
}));

export default router;
