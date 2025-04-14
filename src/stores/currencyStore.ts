import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue-sonner';

export type Currency = 'USD' | 'EUR' | 'RUB';
export type CurrencyRates = Record<string, number>;

export const useCurrencyStore = defineStore('currencyStore', () => {
  const mainCurrency = ref<Currency>('USD');
  const rates = ref<CurrencyRates | null>(null);
  const isLoading = ref<boolean>(true);
  const error = ref<string | null>(null);

  // Function to set the main currency
  function setMainCurrency(currency: Currency) {
    mainCurrency.value = currency;
  }

  // Function to get the correct rate key from the API response
  function getRateKey(from: Currency, to: Currency): string {
    return `${from.toLowerCase()}-${to.toLowerCase()}`;
  }

  // Function to convert currency
  function convertCurrency(amount: number, from: Currency, to: Currency): number {
    if (!rates.value) return 0;
    
    // If the currencies are the same, return the original amount
    if (from === to) return amount;
    
    const directKey = getRateKey(from, to);
    const reverseKey = getRateKey(to, from);
    
    if (rates.value[directKey]) {
      // Direct conversion (e.g., usd-eur)
      return parseFloat((amount * rates.value[directKey]).toFixed(2));
    } else if (rates.value[reverseKey]) {
      // Reverse conversion (e.g., eur-usd but we need usd-eur)
      return parseFloat((amount / rates.value[reverseKey]).toFixed(2));
    } else {
      // Try to convert via another currency as a bridge
      // For simplicity, we'll try USD as a bridge
      const bridge: Currency = 'USD';
      const bridgeFromKey = getRateKey(from, bridge);
      const bridgeToKey = getRateKey(bridge, to);
      const reverseBridgeFromKey = getRateKey(bridge, from);
      const reverseBridgeToKey = getRateKey(to, bridge);
      
      if (rates.value[bridgeFromKey] && rates.value[bridgeToKey]) {
        // Convert from -> bridge -> to
        const amountInBridge = amount * rates.value[bridgeFromKey];
        return parseFloat((amountInBridge * rates.value[bridgeToKey]).toFixed(2));
      } else if (rates.value[reverseBridgeFromKey] && rates.value[bridgeToKey]) {
        // Convert from -> bridge -> to (with reverse from)
        const amountInBridge = amount / rates.value[reverseBridgeFromKey];
        return parseFloat((amountInBridge * rates.value[bridgeToKey]).toFixed(2));
      } else if (rates.value[bridgeFromKey] && rates.value[reverseBridgeToKey]) {
        // Convert from -> bridge -> to (with reverse to)
        const amountInBridge = amount * rates.value[bridgeFromKey];
        return parseFloat((amountInBridge / rates.value[reverseBridgeToKey]).toFixed(2));
      } else if (rates.value[reverseBridgeFromKey] && rates.value[reverseBridgeToKey]) {
        // Convert from -> bridge -> to (with both reverse)
        const amountInBridge = amount / rates.value[reverseBridgeFromKey];
        return parseFloat((amountInBridge / rates.value[reverseBridgeToKey]).toFixed(2));
      }
      
      console.error(`Cannot convert from ${from} to ${to}`);
      return 0;
    }
  }

  // Function to fetch currency rates
  async function fetchRates() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch('https://status.neuralgeneration.com/api/currency');
      if (!response.ok) {
        throw new Error('Failed to fetch currency rates');
      }
      const data = await response.json();
      rates.value = data as CurrencyRates;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      error.value = errorMessage;
      toast.error("Failed to load currency rates");
      console.error("Error fetching currency rates:", err);
    } finally {
      isLoading.value = false;
    }
  }

  // Initialize rates on store creation
  if (process.env.NODE_ENV !== 'test') {
    onMounted(() => {
      fetchRates();
      // Refresh rates every 5 minutes
      const intervalId = setInterval(fetchRates, 5 * 60 * 1000);
    });
  }

  // Computed property to get other currencies
  const otherCurrencies = computed((): Currency[] => {
    const allCurrencies: Currency[] = ['USD', 'EUR', 'RUB'];
    return allCurrencies.filter(currency => currency !== mainCurrency.value);
  });

  return {
    mainCurrency,
    rates,
    isLoading,
    error,
    otherCurrencies,
    setMainCurrency,
    convertCurrency,
    fetchRates,
    getRateKey
  };
});