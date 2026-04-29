'use client';

import { useMutation } from '@tanstack/react-query';
import { useDevices } from './useDevices';
import { useSendCommand } from './useRemoteCommands';

export function useMasterLockdown() {
  const { data: devices } = useDevices();
  const sendCommand = useSendCommand();

  return useMutation({
    mutationFn: async () => {
      if (!devices || devices.length === 0) return;

      const promises = devices.map(device => 
        sendCommand.mutateAsync({
          deviceId: device.id,
          commandType: 'lock_device',
          payload: { reason: 'Master Lockdown triggered from Web' }
        })
      );

      await Promise.all(promises);
    }
  });
}
