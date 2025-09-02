import { advancedProfileData, beginnerProfileData, dummyProfileData, getRandomProfileData } from './dummy-profile-data';
import { UserProfileData } from './services/api';

/**
 * Development utilities for testing profile screen with dummy data
 */

// Toggle this to use dummy data instead of real API
export const USE_DUMMY_DATA = false; // Set to true for testing

// Available dummy profiles
export const DUMMY_PROFILES = {
  regular: dummyProfileData,
  beginner: beginnerProfileData,
  advanced: advancedProfileData,
  random: getRandomProfileData
};

// Current dummy profile to use (change this for testing different scenarios)
export const CURRENT_DUMMY_PROFILE: keyof typeof DUMMY_PROFILES = 'regular';

/**
 * Get dummy profile data for testing
 */
export const getDummyProfile = (): UserProfileData => {
  const profileKey = CURRENT_DUMMY_PROFILE;
  
  if (profileKey === 'random') {
    return DUMMY_PROFILES.random();
  }
  
  return DUMMY_PROFILES[profileKey];
};

/**
 * Simulate API call with dummy data
 */
export const getDummyProfileResponse = async (delayMs: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Dummy profile data loaded",
        data: getDummyProfile()
      });
    }, delayMs);
  });
};

/**
 * Development helper to switch between profiles
 * Usage in development:
 * - console.log('Available profiles:', Object.keys(DUMMY_PROFILES))
 * - switchDummyProfile('beginner')
 */
export const switchDummyProfile = (profileType: keyof typeof DUMMY_PROFILES) => {
  console.log(`🔄 Switching to ${profileType} profile for testing`);
  // You would modify CURRENT_DUMMY_PROFILE here if needed
  return DUMMY_PROFILES[profileType === 'random' ? 'regular' : profileType];
};

/**
 * Log all available dummy data for debugging
 */
export const logDummyData = () => {
  console.log('🎭 Available Dummy Profiles:');
  console.log('- regular: Standard user with good habits');
  console.log('- beginner: New user with minimal data');
  console.log('- advanced: Power user with high consistency');
  console.log('- random: Random profile each time');
  
  console.log('\n📊 Current Profile Data:', getDummyProfile());
};

// Make debugging functions available globally in development
if (__DEV__) {
  (global as any).switchDummyProfile = switchDummyProfile;
  (global as any).logDummyData = logDummyData;
  (global as any).getDummyProfile = getDummyProfile;
}
