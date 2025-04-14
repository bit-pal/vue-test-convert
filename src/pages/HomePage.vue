<template>
  <div class="min-h-screen flex flex-col items-center">
    <div class="container max-w-5xl mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-2">Exchange Rates</h1>
        <p class="text-muted-foreground">
          Current exchange rates for {{ currencyStore.mainCurrency }}
        </p>
      </div>

      <LoadingState v-if="currencyStore.isLoading" />
      <ErrorState v-else-if="currencyStore.error" :message="currencyStore.error" />
      <ErrorState v-else-if="!currencyStore.rates" message="No currency data available" />
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div 
          v-for="currency in currencyStore.otherCurrencies" 
          :key="currency"
          class="overflow-hidden border-2 hover:border-purple/50 transition-all rounded-lg shadow-md"
        >
          <div class="bg-purple/5 pb-2 p-4">
            <div class="flex items-center text-xl">
              <div class="bg-purple/10 p-2 rounded-full mr-3">
                <component :is="getCurrencyIcon(currencyStore.mainCurrency)" class="h-5 w-5" />
              </div>
              <span>1 {{ currencyStore.mainCurrency }} =</span>
            </div>
          </div>
          <div class="pt-6 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="bg-purple/10 p-2 rounded-full mr-3">
                  <component :is="getCurrencyIcon(currency)" class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-2xl font-bold">{{ getRate(currencyStore.mainCurrency, currency) }}</p>
                  <p class="text-sm text-muted-foreground">{{ currency }}</p>
                </div>
              </div>
              <TrendingUp class="h-6 w-6 text-purple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useCurrencyStore, type Currency } from '../stores/currencyStore';
import LoadingState from '../components/LoadingState.vue';
import ErrorState from '../components/ErrorState.vue';
import { DollarSign, Euro, Wallet, TrendingUp } from 'lucide-vue-next';

const currencyStore = inject('currencyStore', useCurrencyStore());

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

const getRate = (from: Currency, to: Currency): string => {
  if (!currencyStore.rates) return 'N/A';
  
  const directKey = currencyStore.getRateKey(from, to);
  const reverseKey = currencyStore.getRateKey(to, from);
  
  let rate: number;
  
  if (currencyStore.rates[directKey]) {
    rate = currencyStore.rates[directKey];
  } else if (currencyStore.rates[reverseKey]) {
    rate = 1 / currencyStore.rates[reverseKey];
  } else {
    console.error(`Rate not found for ${from} to ${to}`);
    return 'N/A';
  }
  
  return rate.toFixed(2);
};
</script>