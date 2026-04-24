import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase';
import { asyncHandler, sendSuccess, sendError } from '../../utils/helpers';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/:deviceId/daily', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const date = req.query.date as string || new Date().toISOString().split('T')[0];
  const { data, error } = await supabaseAdmin.from('daily_reports')
    .select('*').eq('device_id', req.params.deviceId).eq('report_date', date).single();
  if (error || !data) { sendError(res, 'NOT_FOUND', 'No report for this date', 404); return; }
  sendSuccess(res, data);
}));

router.get('/:deviceId/weekly', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const start = req.query.start as string;
  if (!start) { sendError(res, 'VALIDATION_ERROR', 'start query param required', 422); return; }
  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + 7);
  const { data, error } = await supabaseAdmin.from('daily_reports')
    .select('*').eq('device_id', req.params.deviceId)
    .gte('report_date', start).lt('report_date', endDate.toISOString().split('T')[0])
    .order('report_date', { ascending: true });
  if (error) { sendError(res, 'DB_ERROR', 'Failed to fetch reports', 500); return; }
  sendSuccess(res, data);
}));

router.get('/:deviceId/usage', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;
  const { data, error } = await supabaseAdmin.from('usage_events')
    .select('*').eq('device_id', req.params.deviceId)
    .order('occurred_at', { ascending: false }).range(offset, offset + limit - 1);
  if (error) { sendError(res, 'DB_ERROR', 'Failed to fetch usage events', 500); return; }
  sendSuccess(res, data);
}));

router.get('/overview', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const today = new Date().toISOString().split('T')[0];
  const { data: devices } = await supabaseAdmin.from('devices')
    .select('id, device_name, last_seen_at').eq('admin_id', req.userId!);
  const { data: todayReports } = await supabaseAdmin.from('daily_reports')
    .select('*').eq('report_date', today)
    .in('device_id', (devices || []).map(d => d.id));
  sendSuccess(res, { devices: devices || [], reports: todayReports || [] });
}));

export default router;
