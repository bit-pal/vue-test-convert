<template>
    <div class="flex flex-col items-center justify-center min-h-[200px] text-center">
      <div class="text-red-500 mb-4">
        <AlertCircle :size="40" />
      </div>
      <h3 class="text-lg font-medium mb-2">Something went wrong</h3>
      <p class="text-muted-foreground mb-4">{{ message }}</p>
      <button 
        v-if="onRetry"
        @click="onRetry" 
        class="border-purple text-purple hover:bg-purple/10 px-4 py-2 rounded border"
      >
        Try Again
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { AlertCircle } from 'lucide-vue-next';
  
  defineProps<{
    message: string;
    onRetry?: () => void;
  }>();
  </script>

  <script lang="ts">
  export default {
    name: 'ErrorState'
  }
  </script>