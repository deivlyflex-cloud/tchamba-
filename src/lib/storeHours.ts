import { useState, useEffect } from 'react';

export interface StoreHoursStatus {
  isOpen: boolean;
  statusText: string;
  badgeText: string;
  openingTime: string;
  closingTime: string;
}

/**
 * Checks if the store is currently open.
 * Working hours: 10:00 to 23:30.
 * At 23:30 sharp ("quando bate 23 e 30"), it immediately switches to closed.
 */
export function isStoreOpenNow(openingHourStr = '10:00', closingHourStr = '23:30'): boolean {
  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = openingHourStr.split(':').map((v) => parseInt(v, 10) || 0);
    const [closeH, closeM] = closingHourStr.split(':').map((v) => parseInt(v, 10) || 0);

    const openMinutes = openH * 60 + openM; // 10:00 = 600
    const closeMinutes = closeH * 60 + closeM; // 23:30 = 1410

    // Strict boundary: When it reaches closing time (23:30), it is closed (< closeMinutes).
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } catch {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes >= 10 * 60 && currentMinutes < (23 * 60 + 30);
  }
}

/**
 * Hook to reactively observe the open/closed status.
 * Re-checks every 5 seconds to ensure the transition at 23:30 happens promptly.
 */
export function useStoreStatus(): StoreHoursStatus {
  const openingTime = '10:00';
  const closingTime = '23:30';

  const [isOpen, setIsOpen] = useState(() => isStoreOpenNow(openingTime, closingTime));

  useEffect(() => {
    const check = () => {
      setIsOpen(isStoreOpenNow(openingTime, closingTime));
    };

    check();
    // Check every 5 seconds for pinpoint accuracy at 23:30
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    isOpen,
    statusText: isOpen ? 'Aberto Agora' : 'Fechado Agora',
    badgeText: isOpen ? 'Aberto Agora' : 'Fechado',
    openingTime,
    closingTime,
  };
}
