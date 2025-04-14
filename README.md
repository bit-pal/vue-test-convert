# SwiftCurrency

A modern currency converter application built with Vue 3, TypeScript, and Pinia.

## Features

- Real-time currency conversion
- Exchange rate display
- Multiple currency support (USD, EUR, RUB)
- Responsive design
- Error handling and loading states

## Project Structure

```
src/
├── components/           # Reusable Vue components
│   ├── ErrorState.vue   # Error display component
│   ├── Header.vue       # Navigation header
│   └── LoadingState.vue # Loading indicator
├── pages/               # Page components
│   ├── HomePage.vue     # Exchange rates display
│   └── ConvertPage.vue  # Currency converter
├── stores/              # Pinia stores
│   └── currencyStore.ts # Currency data management
└── test/                # Test configuration
    └── setup.ts         # Test environment setup
```

## Testing

The project uses Vitest for testing with the following structure:

### Store Tests

Located in `src/stores/__tests__/currencyStore.test.ts`:

- Store initialization
- Currency conversion
- Rate fetching
- Error handling
- State management

### Component Tests

Components are tested using Vue Test Utils and Testing Library:

- Header component tests
- HomePage component tests
- ConvertPage component tests
- Loading and Error state tests

### Test Setup

The test environment is configured in `src/test/setup.ts`:

- Happy-dom for DOM environment
- Fetch API mocking
- Pinia store testing setup
- Vue Router testing configuration

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Technologies Used

- Vue 3
- TypeScript
- Pinia (State Management)
- Vue Router
- Vitest (Testing)
- Testing Library
- Happy-dom (DOM Environment)
- Tailwind CSS

## Testing Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
