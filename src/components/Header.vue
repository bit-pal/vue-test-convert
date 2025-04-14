<template>
    <header class="sticky top-0 z-50 w-full border-b header-gradient backdrop-blur supports-[backdrop-filter]:bg-opacity-60">
      <div class="container flex h-16 items-center justify-between">
        <div class="mr-4 flex items-center">
          <router-link to="/" class="flex items-center">
            <span class="text-white font-bold text-2xl ml-4">SwiftCurrency</span>
          </router-link>
        </div>
        
        <nav class="flex flex-1 items-center justify-between">
          <ul class="flex space-x-4">
            <li>
              <router-link 
                to="/" 
                class="px-4 py-2 rounded-md transition-colors text-white"
                :class="route.path === '/' ? 'bg-blue-600 font-medium' : 'hover:bg-blue-600/20'"
              >
                Home
              </router-link>
            </li>
            <li>
              <router-link 
                to="/convert" 
                class="px-4 py-2 rounded-md transition-colors text-white"
                :class="route.path === '/convert' ? 'bg-blue-600 font-medium' : 'hover:bg-blue-600/20'"
              >
                Convert
              </router-link>
            </li>
          </ul>
          
          <div class="flex items-center space-x-2 ml-4">
            <span class="mr-2 text-sm font-medium text-white">Main Currency:</span>
            <select 
              v-model="currencyStore.mainCurrency" 
              class="w-[130px] bg-white/90 border border-blue-200 rounded px-2 py-1"
            >
              <option value="USD" class="flex items-center">USD</option>
              <option value="EUR" class="flex items-center">EUR</option>
              <option value="RUB" class="flex items-center">RUB</option>
            </select>
          </div>
        </nav>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { inject } from 'vue';
  import { useCurrencyStore } from '../stores/currencyStore';
  
  const route = useRoute();
  const currencyStore = inject('currencyStore') || useCurrencyStore();
  </script>

  <style scoped>
  .container {
    margin: 0 auto;
    padding: 0 1rem;
    max-width: 1200px;
  }

  .header-gradient {
    background: linear-gradient(
      90deg,
      rgb(59, 130, 246) 0%,
      rgb(158, 187, 245) 30%,
      rgb(161, 187, 240) 70%,
      rgb(59, 130, 246) 100%
    );
  }
  </style>