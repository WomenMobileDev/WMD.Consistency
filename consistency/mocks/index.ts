// Export everything from mocks for easy importing
export {
    addHandlers,
    overrideHandlers, resetMocks, server,
    startMocking,
    stopMocking
} from './server';

// Export config functions for easy toggling
export {
    disableMocking, enableMocking, mockConfig, shouldUseMocking
} from './config';

// Development utilities
export const mockingUtils = {
  // Check if we're in development
  isDevelopment: __DEV__,
  
  // Main mocking control - uses config.ts
  shouldEnableMocking: () => {
    const { shouldUseMocking } = require('./config');
    return shouldUseMocking();
  },
  
  // Log mocking status
  logMockingStatus: (enabled: boolean) => {
    if (enabled) {
      console.log('🔧 API mocking is ENABLED');
      console.log('🔧 All API calls will use mock data');
      console.log('💡 To use real API: import { disableMocking } from "@/mocks" and call disableMocking()');
    } else {
      console.log('🔧 API mocking is DISABLED');
      console.log('🔧 API calls will go to real endpoints');
      console.log('💡 To use mock data: import { enableMocking } from "@/mocks" and call enableMocking()');
    }
  }
};
