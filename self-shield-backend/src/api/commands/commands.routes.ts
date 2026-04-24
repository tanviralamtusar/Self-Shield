import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../config/supabase';
import { asyncHandler, sendSuccess, sendError } from '../../utils/helpers';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { sendFcmMessage } from '../../config/firebase';

const router = Router();

router.use(authMiddleware);

const createCommandSchema = z.object({
  device_id: z.string().uuid(),
  command_type: z.enum([
    'push_blocklist', 'reset_pin', 'approve_override',
    'update_app_rules', 'sync_request', 'lock_device',
  ]),
  payload: z.record(z.string(), z.unknown()).optional(),
});

/**
 * POST /commands
 * Create a remote command (admin → device).
 */
router.post(
  '/',
  requireAdmin,
  validate(createCommandSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { device_id, command_type, payload } = req.body;

    // Verify admin owns this device
    const { data: device } = await supabaseAdmin
      .from('devices')
      .select('id, fcm_token')
      .eq('id', device_id)
      .eq('admin_id', req.userId!)
      .single();

    if (!device) {
      sendError(res, 'NOT_FOUND', 'Device not found', 404);
      return;
    }

    // Create command
    const { data: command, error } = await supabaseAdmin
      .from('remote_commands')
      .insert({ device_id, command_type, payload })
      .select()
      .single();

    if (error || !command) {
      sendError(res, 'DB_ERROR', 'Failed to create command', 500);
      return;
    }

    // Send FCM if token available
    if (device.fcm_token) {
      await sendFcmMessage(device.fcm_token, {
        command_id: command.id,
        type: command_type,
        payload: JSON.stringify(payload || {}),
      });

      await supabaseAdmin
        .from('remote_commands')
        .update({ status: 'delivered' })
        .eq('id', command.id);
    }

    sendSuccess(res, command, 201);
  })
);

/**
 * GET /commands/:deviceId
 * Poll pending commands for a device (called by device).
 */
router.get(
  '/:deviceId',
  asyncHandler(async (req: Request, res: Response) => {
    const { data: commands, error } = await supabaseAdmin
      .from('remote_commands')
      .select('*')
      .eq('device_id', req.params.deviceId)
      .in('status', ['pending', 'delivered'])
      .order('created_at', { ascending: true });

    if (error) {
      sendError(res, 'DB_ERROR', 'Failed to fetch commands', 500);
      return;
    }

    sendSuccess(res, commands);
  })
);

const updateStatusSchema = z.object({
  status: z.enum(['executed', 'failed']),
});

/**
 * PATCH /commands/:id/status
 * Device marks command as executed or failed.
 */
router.patch(
  '/:id/status',
  validate(updateStatusSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { data: command, error } = await supabaseAdmin
      .from('remote_commands')
      .update({
        status: req.body.status,
        executed_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !command) {
      sendError(res, 'NOT_FOUND', 'Command not found', 404);
      return;
    }

    sendSuccess(res, command);
  })
);

export default router;
