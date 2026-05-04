import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { settings } from '../api/admin';

const DEFAULT_CURRENCY = 'EGP';

export const formatMoney = (value, currency = DEFAULT_CURRENCY) => {
  const amount = Number(value || 0);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || DEFAULT_CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency || DEFAULT_CURRENCY}`;
  }
};

/**
 * العملة من إعدادات السيرفر (قاعدة البيانات) — لا تُحفظ في localStorage
 */
export const useAppCurrency = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => (await settings.get()).data,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const raw = data?.data ?? data;
  const payment = raw?.paymentSettings;
  const currency = payment?.currency || DEFAULT_CURRENCY;

  const format = useMemo(
    () => (value) => formatMoney(value, currency),
    [currency]
  );

  return { currency, formatMoney: format };
};
