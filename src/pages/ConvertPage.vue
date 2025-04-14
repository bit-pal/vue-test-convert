<template>
  <div class="min-h-screen flex flex-col items-center">
    <div class="container max-w-5xl mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-2">Currency Converter</h1>
        <p class="text-muted-foreground">
          Convert between currencies with real-time exchange rates
        </p>
      </div>

      <LoadingState v-if="currencyStore.isLoading" />
      <ErrorState v-else-if="currencyStore.error" :message="currencyStore.error" />
      <ErrorState v-else-if="!currencyStore.rates" message="No currency data available" />
      <div v-else class="max-w-md mx-auto shadow-lg border-2 border-muted rounded-lg bg-white">
        <div class="pt-6 p-4">
          <div class="space-y-4">
            <!-- Top currency input -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label for="topAmount" class="text-sm font-medium">
                  From
                </label>
                <select 
                  v-model="topCurrency" 
                  class="w-[120px] h-8 bg-background border border-gray-300 rounded px-2 py-1"
                  data-testid="from-select"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <component :is="getCurrencyIcon(topCurrency)" class="h-4 w-4" />
                </div>
                <input
                  id="topAmount"
                  type="text"
                  v-model="topAmount"
                  @input="handleTopAmountChange"
                  class="pl-10 bg-background w-full border border-gray-300 rounded h-10 px-3"
                  placeholder="0.00"
                  data-testid="amount-input"
                />
              </div>
            </div>

            <!-- Swap icon -->
            <div class="flex justify-center">
              <ArrowDownUp class="h-5 w-5 text-purple" />
            </div>

            <!-- Bottom currency input -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label for="bottomAmount" class="text-sm font-medium">
                  To
                </label>
                <select 
                  v-model="bottomCurrency" 
                  class="w-[120px] h-8 bg-background border border-gray-300 rounded px-2 py-1"
                  data-testid="to-select"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <component :is="getCurrencyIcon(bottomCurrency)" class="h-4 w-4" />
                </div>
                <input
                  id="bottomAmount"
                  type="text"
                  v-model="bottomAmount"
                  @input="handleBottomAmountChange"
                  class="pl-10 bg-background w-full border border-gray-300 rounded h-10 px-3"
                  placeholder="0.00"
                  data-testid="converted-input"
                />
              </div>
            </div>

            <!-- Exchange rate info -->
            <div class="pt-4 text-center text-sm text-muted-foreground">
              <p v-if="topAmount && !isNaN(parseFloat(topAmount))">
                1 {{ topCurrency }} = {{ getConversionRate(topCurrency, bottomCurrency) }} {{ bottomCurrency }}
              </p>
            </div>

            <!-- Exchange button -->
            <div class="pt-4">
              <button 
                @click="handleSwapCurrencies"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                data-testid="exchange-button"
              >
                Exchange
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue';
import { useCurrencyStore, type Currency } from '../stores/currencyStore';
import LoadingState from '../components/LoadingState.vue';
import ErrorState from '../components/ErrorState.vue';
import { ArrowDownUp, DollarSign, Euro, Wallet } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const currencyStore = inject('currencyStore', useCurrencyStore());

const topCurrency = ref<Currency>('USD');
const bottomCurrency = ref<Currency>('EUR');
const topAmount = ref<string>('1');
const bottomAmount = ref<string>('');
const activeInput = ref<'top' | 'bottom'>('top');

const getCurrencyIcon = (currency: Currency) => {
  switch (currency) {
    case 'USD':
      return DollarSign;
    case 'EUR':
      return Euro;
    case 'RUB':
      return Wallet;
    default:
      return null;
  }
};

// Swap currencies
const handleSwapCurrencies = () => {
  const tempCurrency = topCurrency.value;
  topCurrency.value = bottomCurrency.value;
  bottomCurrency.value = tempCurrency;
  
  const tempAmount = topAmount.value;
  topAmount.value = bottomAmount.value;
  bottomAmount.value = tempAmount;
};

// Handle top input change
const handleTopAmountChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  
  // Allow empty input or valid number
  if (value === '' || /^\d*\.?\d*$/.test(value)) {
    topAmount.value = value;
    activeInput.value = 'top';
  }
};

// Handle bottom input change
const handleBottomAmountChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  
  // Allow empty input or valid number
  if (value === '' || /^\d*\.?\d*$/.test(value)) {
    bottomAmount.value = value;
    activeInput.value = 'bottom';
  }
};

// Get conversion rate between two currencies
const getConversionRate = (from: Currency, to: Currency): string => {
  try {
    const rate = currencyStore.convertCurrency(1, from, to);
    return rate.toFixed(2);
  } catch (error) {
    return 'N/A';
  }
};

// Update conversion when inputs change
watch(
  [topAmount, bottomAmount, topCurrency, bottomCurrency, activeInput, () => currencyStore.rates],
  () => {
    if (!currencyStore.rates) return;

    try {
      if (activeInput.value === 'top' && topAmount.value) {
        const amount = parseFloat(topAmount.value);
        if (!isNaN(amount)) {
          const converted = currencyStore.convertCurrency(amount, topCurrency.value, bottomCurrency.value);
          bottomAmount.value = converted.toString();
        } else if (topAmount.value === '') {
          bottomAmount.value = '';
        }
      } else if (activeInput.value === 'bottom' && bottomAmount.value) {
        const amount = parseFloat(bottomAmount.value);
        if (!isNaN(amount)) {
          const converted = currencyStore.convertCurrency(amount, bottomCurrency.value, topCurrency.value);
          topAmount.value = converted.toString();
        } else if (bottomAmount.value === '') {
          topAmount.value = '';
        }
      }
    } catch (err) {
      toast.error("Error performing conversion");
      console.error("Conversion error:", err);
    }
  },
  { deep: true }
);
</script>