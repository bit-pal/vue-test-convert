<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Header />
    <main class="flex-1">
      <router-view></router-view>
    </main>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import Header from './components/Header.vue';
import { useCurrencyStore } from './stores/currencyStore';
import { Toaster } from 'vue-sonner';

// Initialize the currency store and provide it to all components
const currencyStore = useCurrencyStore();
provide('currencyStore', currencyStore);
</script>

<style>
@import './index.css';
</style>
