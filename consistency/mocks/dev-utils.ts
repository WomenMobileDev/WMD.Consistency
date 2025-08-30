// Note: Dev utilities are simplified for our custom axios interceptor
import { server } from './server';

/**
 * Development utilities for testing different API scenarios
 * These can be called from the React Native debugger console or through dev menus
 */

// Simulate network delays
export const simulateNetworkDelay = (delayMs: number = 2000) => {
  console.log(`🔧 MSW: Simulating ${delayMs}ms network delay`);
  // Note: Network delay simulation would need to be implemented in the axios interceptor
  // For now, this is a placeholder
};

// Simulate authentication errors
export const simulateAuthError = () => {
  console.log('🔧 MSW: Simulating authentication errors');
  // Note: Error simulation would need to be implemented in the axios interceptor
};

// Simulate server errors
export const simulateServerError = () => {
  console.log('🔧 MSW: Simulating server errors');
  // Note: Error simulation would need to be implemented in the axios interceptor
};

// Simulate network timeout
export const simulateNetworkTimeout = () => {
  console.log('🔧 MSW: Simulating network timeout');
  // Note: Timeout simulation would need to be implemented in the axios interceptor
};

// Reset to normal behavior
export const resetToNormalBehavior = () => {
  console.log('🔧 MSW: Resetting to normal behavior');
  server.resetHandlers();
};

// Test scenarios object for easy access
export const testScenarios = {
  normal: resetToNormalBehavior,
  slowNetwork: () => simulateNetworkDelay(3000),
  authErrors: simulateAuthError,
  serverErrors: simulateServerError,
  networkTimeout: simulateNetworkTimeout,
};

// Global dev utils (accessible from console)
if (__DEV__) {
  // Make utilities available globally for debugging
  (global as any).mswDevUtils = {
    ...testScenarios,
    simulateDelay: simulateNetworkDelay,
    server,
  };
  
  console.log('🔧 MSW: Dev utilities available at global.mswDevUtils');
  console.log('🔧 MSW: Available scenarios:', Object.keys(testScenarios));
}
