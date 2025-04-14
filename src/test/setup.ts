import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/vue';
import * as matchers from '@testing-library/jest-dom/matchers';
import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import { createPinia } from 'pinia'

// Set test environment
process.env.NODE_ENV = 'test';

// Extend Vitest's expect method with Testing Library matchers
expect.extend(matchers as any);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window and document
const { window } = new (require('happy-dom').Window)({
  url: 'http://localhost:5173'
})
global.window = window
global.document = window.document

// Mock fetch
global.fetch = vi.fn()

// Configure Vue Test Utils
config.global.mocks = {
  $t: (key: string) => key
}

// Create and set up Pinia store
const pinia = createPinia()
config.global.plugins = [pinia] 