import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../config/supabase';
import { asyncHandler, sendSuccess, sendError } from '../../utils/helpers';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';

const router = Router();

// Apply auth to all device routes
router.use(authMiddleware);

/**
 * GET /devices
 * List all devices for the authenticated admin.
 */
router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { data: devices, error } = await supabaseAdmin
      .from('devices')
      .select('*')
      .eq('admin_id', req.userId!)
      .order('created_at', { ascending: false });

    if (error) {
      sendError(res, 'DB_ERROR', 'Failed to fetch devices', 500);
      return;
    }

    sendSuccess(res, devices);
  })
);

/**
 * GET /devices/:id
 * Get a single device by ID.
 */
router.get(
  '/:id',
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { data: device, error } = await supabaseAdmin
      .from('devices')
      .select('*')
      .eq('id', req.params.id)
      .eq('admin_id', req.userId!)
      .single();

    if (error || !device) {
      sendError(res, 'NOT_FOUND', 'Device not found', 404);
      return;
    }

    sendSuccess(res, device);
  })
);

// Validation schemas
const pairDeviceSchema = z.object({
  pairing_code: z.string().length(6, 'Pairing code must be 6 digits'),
});

/**
 * POST /devices/pair
 * Link a child device using a pairing code.
 */
router.post(
  '/pair',
  validate(pairDeviceSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { pairing_code } = req.body;

    // Find device with this pairing code
    const { data: device, error } = await supabaseAdmin
      .from('devices')
      .select('*')
      .eq('pairing_code', pairing_code)
      .single();

    if (error || !device) {
      sendError(res, 'INVALID_CODE', 'Invalid or expired pairing code', 400);
      return;
    }

    // Update device to link with admin
    const { data: updatedDevice, error: updateError } = await supabaseAdmin
      .from('devices')
      .update({
        admin_id: req.userId!,
        pairing_code: null, // Consume the code
      })
      .eq('id', device.id)
      .select()
      .single();

    if (updateError) {
      sendError(res, 'DB_ERROR', 'Failed to pair device', 500);
      return;
    }

    sendSuccess(res, updatedDevice, 201);
  })
);

const updateSettingsSchema = z.object({
  vpn_enabled: z.boolean().optional(),
  keyword_blocking: z.boolean().optional(),
  inapp_blocking: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

/**
 * PATCH /devices/:id/settings
 * Update device settings remotely.
 */
router.patch(
  '/:id/settings',
  requireAdmin,
  validate(updateSettingsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    // Verify device belongs to admin
    const { data: device } = await supabaseAdmin
      .from('devices')
      .select('id')
      .eq('id', req.params.id)
      .eq('admin_id', req.userId!)
      .single();

    if (!device) {
      sendError(res, 'NOT_FOUND', 'Device not found', 404);
      return;
    }

    const { data: settings, error } = await supabaseAdmin
      .from('device_settings')
      .upsert({
        device_id: req.params.id,
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      sendError(res, 'DB_ERROR', 'Failed to update settings', 500);
      return;
    }

    sendSuccess(res, settings);
  })
);

/**
 * POST /devices/:id/sync
 * Receive sync payload from device.
 */
router.post(
  '/:id/sync',
  asyncHandler(async (req: Request, res: Response) => {
    const deviceId = req.params.id;
    const { usage_events, audit_events, device_info } = req.body;

    // Update device info (last_seen, versions)
    await supabaseAdmin
      .from('devices')
      .update({
        last_seen_at: new Date().toISOString(),
        android_version: device_info?.android_version,
        app_version: device_info?.app_version,
        is_device_owner: device_info?.is_device_owner,
      })
      .eq('id', deviceId);

    // Batch insert usage events
    if (usage_events?.length > 0) {
      const events = usage_events.map((e: Record<string, unknown>) => ({
        ...e,
        device_id: deviceId,
      }));
      await supabaseAdmin.from('usage_events').insert(events);
    }

    // Batch insert audit events
    if (audit_events?.length > 0) {
      const events = audit_events.map((e: Record<string, unknown>) => ({
        ...e,
        device_id: deviceId,
      }));
      await supabaseAdmin.from('audit_log').insert(events);
    }

    sendSuccess(res, { synced: true });
  })
);

/**
 * DELETE /devices/:id
 * Unlink a device.
 */
router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { error } = await supabaseAdmin
      .from('devices')
      .delete()
      .eq('id', req.params.id)
      .eq('admin_id', req.userId!);

    if (error) {
      sendError(res, 'DB_ERROR', 'Failed to delete device', 500);
      return;
    }

    sendSuccess(res, { deleted: true });
  })
);

export default router;
