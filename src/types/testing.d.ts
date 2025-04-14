declare module '@pinia/testing' {
  import type { TestingOptions } from '@pinia/testing'
  export function createTestingPinia(options?: TestingOptions): any
} 