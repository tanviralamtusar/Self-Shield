import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../config/supabase';
import { asyncHandler, sendSuccess, sendError } from '../../utils/helpers';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { sendFcmMessage } from '../../config/firebase';

const router = Router();

router.use(authMiddleware);

/**
 * GET /blocklists
 * List all block lists visible to admin (own + system/public).
 */
router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { data: lists, error } = await supabaseAdmin
      .from('block_lists')
      .select('*, block_list_entries(count)')
      .or(`owner_id.eq.${req.userId},is_public.eq.true`)
      .order('created_at', { ascending: false });

    if (error) {
      sendError(res, 'DB_ERROR', 'Failed to fetch block lists', 500);
      return;
    }

    sendSuccess(res, lists);
  })
);

const createBlocklistSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['hostname', 'app_package', 'keyword']),
  category: z.string().optional(),
});

/**
 * POST /blocklists
 * Create a new custom block list.
 */
router.post(
  '/',
  requireAdmin,
  validate(createBlocklistSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { data: list, error } = await supabaseAdmin
      .from('block_lists')
      .insert({
        owner_id: req.userId!,
        name: req.body.name,
        type: req.body.type,
        category: req.body.category || 'custom',
      })
      .select()
      .single();

    if (error) {
      sendError(res, 'DB_ERROR', 'Failed to create block list', 500);
      return;
    }

    sendSuccess(res, list, 201);
  })
);

/**
 * PATCH /blocklists/:id
 * Update a block list.
 */
router.patch(
  '/:id',
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { data: list, error } = await supabaseAdmin
      .from('block_lists')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .eq('owner_id', req.userId!)
      .select()
      .single();

    if (error || !list) {
      sendError(res, 'NOT_FOUND', 'Block list not found', 404);
      return;
    }

    sendSuccess(res, list);
  })
);

/**
 * DELETE /blocklists/:id
 */
router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { error } = await supabaseAdmin
      .from('block_lists')
      .delete()
      .eq('id', req.params.id)
      .eq('owner_id', req.userId!);

    if (error) {
      sendError(res, 'DB_ERROR', 'Failed to delete block list', 500);
      return;
    }

    sendSuccess(res, { deleted: true });
  })
);

const addEntriesSchema = z.object({
  entries: z.array(
    z.object({
      value: z.string().min(1),
      is_regex: z.boolean().optional().default(false),
    })
  ),
});

/**
 * POST /blocklists/:id/entries
 * Add entries in bulk to a block list.
 */
router.post(
  '/:id/entries',
  requireAdmin,
  validate(addEntriesSchema),
  asyncHandler(async (req: Request, res: Response) => {
    // Verify ownership
    const { data: list } = await supabaseAdmin
      .from('block_lists')
      .select('id')
      .eq('id', req.params.id)
      .eq('owner_id', req.userId!)
      .single();

    if (!list) {
      sendError(res, 'NOT_FOUND', 'Block list not found', 404);
      return;
    }

    const entries = req.body.entries.map((e: { value: string; is_regex?: boolean }) => ({
      block_list_id: req.params.id,
      value: e.value,
      is_regex: e.is_regex || false,
    }));

    const { data, error } = await supabaseAdmin
      .from('block_list_entries')
      .insert(entries)
      .select();

    if (error) {
      sendError(res, 'DB_ERROR', 'Failed to add entries', 500);
      return;
    }

    // Bump list version
    await supabaseAdmin
      .from('block_lists')
      .update({
        version: list.id, // Will use increment in real impl
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id);

    sendSuccess(res, data, 201);
  })
);

/**
 * DELETE /blocklists/:id/entries/:eid
 */
router.delete(
  '/:id/entries/:eid',
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { error } = await supabaseAdmin
      .from('block_list_entries')
      .delete()
      .eq('id', req.params.eid)
      .eq('block_list_id', req.params.id);

    if (error) {
      sendError(res, 'DB_ERROR', 'Failed to delete entry', 500);
      return;
    }

    sendSuccess(res, { deleted: true });
  })
);

/**
 * POST /blocklists/push/:deviceId
 * Push updated block lists to a device via FCM.
 */
router.post(
  '/push/:deviceId',
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { deviceId } = req.params;

    // Get device FCM token
    const { data: device } = await supabaseAdmin
      .from('devices')
      .select('fcm_token')
      .eq('id', deviceId)
      .eq('admin_id', req.userId!)
      .single();

    if (!device?.fcm_token) {
      sendError(res, 'NOT_FOUND', 'Device not found or no FCM token', 404);
      return;
    }

    // Create remote command
    const { data: command, error } = await supabaseAdmin
      .from('remote_commands')
      .insert({
        device_id: deviceId,
        command_type: 'push_blocklist',
        payload: { list_ids: req.body.list_ids },
      })
      .select()
      .single();

    if (error || !command) {
      sendError(res, 'DB_ERROR', 'Failed to create command', 500);
      return;
    }

    // Send FCM message
    await sendFcmMessage(device.fcm_token, {
      command_id: command.id,
      type: 'push_blocklist',
      payload: JSON.stringify({ list_ids: req.body.list_ids }),
    });

    sendSuccess(res, { command_id: command.id, status: 'sent' });
  })
);

export default router;
