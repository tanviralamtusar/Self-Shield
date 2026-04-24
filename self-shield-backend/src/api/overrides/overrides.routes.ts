import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../config/supabase';
import { asyncHandler, sendSuccess, sendError } from '../../utils/helpers';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { sendFcmMessage } from '../../config/firebase';

const router = Router();
router.use(authMiddleware);

const createOverrideSchema = z.object({
  device_id: z.string().uuid(),
  reason: z.string().optional(),
});

router.post('/', validate(createOverrideSchema), asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('override_requests')
    .insert({ device_id: req.body.device_id, reason: req.body.reason }).select().single();
  if (error) { sendError(res, 'DB_ERROR', 'Failed to create override', 500); return; }
  sendSuccess(res, data, 201);
}));

router.get('/pending', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('override_requests')
    .select('*, devices!inner(device_name, admin_id)')
    .eq('devices.admin_id', req.userId!).eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) { sendError(res, 'DB_ERROR', 'Failed to fetch overrides', 500); return; }
  sendSuccess(res, data);
}));

const approveSchema = z.object({ duration_min: z.number().int().min(5).max(120).default(15) });

router.patch('/:id/approve', requireAdmin, validate(approveSchema), asyncHandler(async (req: Request, res: Response) => {
  const expiresAt = new Date(Date.now() + req.body.duration_min * 60 * 1000);
  const { data, error } = await supabaseAdmin.from('override_requests').update({
    status: 'approved', approved_by: req.userId!, duration_min: req.body.duration_min,
    expires_at: expiresAt.toISOString(), resolved_at: new Date().toISOString(),
  }).eq('id', req.params.id).select('*, devices!inner(fcm_token)').single();
  if (error || !data) { sendError(res, 'NOT_FOUND', 'Override not found', 404); return; }

  const fcmToken = (data as any).devices?.fcm_token;
  if (fcmToken) {
    const { data: cmd } = await supabaseAdmin.from('remote_commands').insert({
      device_id: data.device_id, command_type: 'approve_override',
      payload: { duration_min: req.body.duration_min, expires_at: expiresAt.toISOString() },
    }).select().single();
    if (cmd) await sendFcmMessage(fcmToken, { command_id: cmd.id, type: 'approve_override', payload: JSON.stringify(cmd.payload) });
  }
  sendSuccess(res, data);
}));

router.patch('/:id/deny', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('override_requests').update({
    status: 'denied', approved_by: req.userId!, resolved_at: new Date().toISOString(),
  }).eq('id', req.params.id).select().single();
  if (error || !data) { sendError(res, 'NOT_FOUND', 'Override not found', 404); return; }
  sendSuccess(res, data);
}));

router.get('/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('override_requests')
    .select('status, duration_min, expires_at').eq('id', req.params.id).single();
  if (error || !data) { sendError(res, 'NOT_FOUND', 'Override not found', 404); return; }
  sendSuccess(res, data);
}));

export default router;
