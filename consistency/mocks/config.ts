// Mock configuration - easily switch between mock and real API

export const mockConfig = {
  // Set this to false to use real API in development
  ENABLE_MOCKING: true,
  
  // Set this to true for more detailed debug logs
  DEBUG_LOGS: true,
  
  // Real API base URL (when mocking is disabled)
  REAL_API_URL: 'https://11b204d31f58.ngrok-free.app/api/v1',
};

// Quick toggle functions for easy switching
export const enableMocking = () => {
  mockConfig.ENABLE_MOCKING = true;
  console.log('🔧 Mocking ENABLED - using mock data');
};

export const disableMocking = () => {
  mockConfig.ENABLE_MOCKING = false;
  console.log('🔧 Mocking DISABLED - using real API');
};

// Check if mocking should be enabled
export const shouldUseMocking = () => {
  return __DEV__ && mockConfig.ENABLE_MOCKING;
};
