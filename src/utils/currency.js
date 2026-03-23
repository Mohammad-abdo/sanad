import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'sanad_admin_currency';
const DEFAULT_CURRENCY = 'EGP';

export const getStoredCurrency = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
};

export const setStoredCurrency = (currency) => {
  try {
    localStorage.setItem(STORAGE_KEY, currency || DEFAULT_CURRENCY);
    window.dispatchEvent(new Event('sanad-currency-changed'));
  } catch {
    // Ignore storage issues and keep app usable.
  }
};

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

export const useAppCurrency = () => {
  const [currency, setCurrency] = useState(getStoredCurrency());

  useEffect(() => {
    const handleCurrencyChanged = () => setCurrency(getStoredCurrency());
    window.addEventListener('sanad-currency-changed', handleCurrencyChanged);
    window.addEventListener('storage', handleCurrencyChanged);
    return () => {
      window.removeEventListener('sanad-currency-changed', handleCurrencyChanged);
      window.removeEventListener('storage', handleCurrencyChanged);
    };
  }, []);

  const format = useMemo(
    () => (value) => formatMoney(value, currency),
    [currency]
  );

  return { currency, formatMoney: format };
};

