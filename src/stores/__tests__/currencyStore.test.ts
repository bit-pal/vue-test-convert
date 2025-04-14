import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCurrencyStore } from '../currencyStore';

describe('currencyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  it('should initialize with default values', () => {
    const store = useCurrencyStore();
    expect(store.mainCurrency).toBe('USD');
    expect(store.rates).toBeNull();
    expect(store.isLoading).toBe(true);
    expect(store.error).toBeNull();
  });

  it('should set main currency', () => {
    const store = useCurrencyStore();
    store.setMainCurrency('EUR');
    expect(store.mainCurrency).toBe('EUR');
  });

  it('should get correct rate key', () => {
    const store = useCurrencyStore();
    expect(store.getRateKey('USD', 'EUR')).toBe('usd-eur');
    expect(store.getRateKey('USD', 'RUB')).toBe('usd-rub');
  });

  it('should handle different currency cases in getRateKey', () => {
    const store = useCurrencyStore();
    expect(store.getRateKey('USD', 'EUR')).toBe('usd-eur');
    expect(store.getRateKey('EUR', 'RUB')).toBe('eur-rub');
    expect(store.getRateKey('RUB', 'USD')).toBe('rub-usd');
  });

  it('should convert currency correctly when rates are available', () => {
    const store = useCurrencyStore();
    store.rates = {
      'usd-eur': 0.85,
      'eur-usd': 1.18
    };
    expect(store.convertCurrency(100, 'USD', 'EUR')).toBe(85);
    expect(store.convertCurrency(100, 'EUR', 'USD')).toBe(118);
  });

  it('should handle currency conversion when rates are not available', () => {
    const store = useCurrencyStore();
    store.rates = null;
    expect(store.convertCurrency(100, 'USD', 'EUR')).toBe(0);
  });

  it('should handle fetch rates success', async () => {
    const mockRates = {
      'usd-eur': 0.85,
      'usd-rub': 75.5
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRates)
    });

    const store = useCurrencyStore();
    await store.fetchRates();

    expect(store.rates).toEqual(mockRates);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should handle fetch rates when response is not OK', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    const store = useCurrencyStore();
    await store.fetchRates();

    expect(store.rates).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe('Failed to fetch currency rates');
  });

  it('should handle fetch rates when response JSON is invalid', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON'))
    });

    const store = useCurrencyStore();
    await store.fetchRates();

    expect(store.rates).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe('Invalid JSON');
  });

  it('should handle fetch rates error', async () => {
    const errorMessage = 'Network error';
    global.fetch = vi.fn().mockRejectedValue(new Error(errorMessage));

    const store = useCurrencyStore();
    await store.fetchRates();

    expect(store.rates).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe(errorMessage);
  });
}); 