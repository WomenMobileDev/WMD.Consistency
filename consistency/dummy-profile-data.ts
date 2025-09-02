import { UserProfileData, UserProfileResponse } from './services/api';

// Comprehensive dummy profile data matching the API structure
export const dummyProfileData: UserProfileData = {
  id: 1,
  email: "john.doe@example.com",
  name: "John Doe",
  created_at: "2024-08-01T10:00:00.000Z",
  overview: {
    total_habits: 8,
    active_habits: 6,
    total_check_ins: 127,
    total_achievements: 5,
    days_since_joined: 45,
    overall_consistency: 78.5,
    weekly_consistency: 85.7,
    monthly_consistency: 76.2
  },
  streak_insights: {
    current_longest_streak: 12,
    best_streak_ever: 18,
    average_streak_length: 6.8,
    active_streaks_count: 4
  },
  consistency_chart: [
    {
      date: "2025-01-25T00:00:00Z",
      percentage: 60,
      check_ins: 3,
      total_habits: 5
    },
    {
      date: "2025-01-26T00:00:00Z",
      percentage: 80,
      check_ins: 4,
      total_habits: 5
    },
    {
      date: "2025-01-27T00:00:00Z",
      percentage: 100,
      check_ins: 5,
      total_habits: 5
    },
    {
      date: "2025-01-28T00:00:00Z",
      percentage: 75,
      check_ins: 4,
      total_habits: 5
    },
    {
      date: "2025-01-29T00:00:00Z",
      percentage: 40,
      check_ins: 2,
      total_habits: 5
    },
    {
      date: "2025-01-30T00:00:00Z",
      percentage: 90,
      check_ins: 4,
      total_habits: 5
    },
    {
      date: "2025-01-31T00:00:00Z",
      percentage: 85,
      check_ins: 4,
      total_habits: 5
    }
  ],
  top_habits: [
    {
      habit_id: 1,
      habit_name: "Morning Meditation",
      consistency_rate: 95,
      current_streak: 18,
      total_check_ins: 42,
      last_check_in: "2025-01-31T06:30:00Z"
    },
    {
      habit_id: 2,
      habit_name: "Drink 8 Glasses of Water",
      consistency_rate: 88,
      current_streak: 12,
      total_check_ins: 38,
      last_check_in: "2025-01-31T20:15:00Z"
    },
    {
      habit_id: 3,
      habit_name: "Read for 30 Minutes",
      consistency_rate: 82,
      current_streak: 8,
      total_check_ins: 35,
      last_check_in: "2025-01-31T22:00:00Z"
    },
    {
      habit_id: 4,
      habit_name: "Exercise",
      consistency_rate: 76,
      current_streak: 5,
      total_check_ins: 28,
      last_check_in: "2025-01-31T07:45:00Z"
    },
    {
      habit_id: 5,
      habit_name: "Write Journal",
      consistency_rate: 70,
      current_streak: 3,
      total_check_ins: 24,
      last_check_in: "2025-01-30T23:30:00Z"
    }
  ],
  recent_achievements: [
    {
      id: 1,
      user_id: 1,
      habit_id: 1,
      achievement_type: "streak_completed",
      target_days: 14,
      achieved_at: "2025-01-28T06:30:00Z",
      metadata: {
        streak_id: 1,
        habit_name: "Morning Meditation"
      }
    },
    {
      id: 2,
      user_id: 1,
      habit_id: 2,
      achievement_type: "streak_completed",
      target_days: 7,
      achieved_at: "2025-01-25T15:20:00Z",
      metadata: {
        streak_id: 2,
        habit_name: "Drink 8 Glasses of Water"
      }
    },
    {
      id: 3,
      user_id: 1,
      habit_id: 3,
      achievement_type: "streak_completed",
      target_days: 21,
      achieved_at: "2025-01-20T22:00:00Z",
      metadata: {
        streak_id: 3,
        habit_name: "Read for 30 Minutes"
      }
    },
    {
      id: 4,
      user_id: 1,
      habit_id: 4,
      achievement_type: "streak_completed",
      target_days: 10,
      achieved_at: "2025-01-15T07:45:00Z",
      metadata: {
        streak_id: 4,
        habit_name: "Exercise"
      }
    },
    {
      id: 5,
      user_id: 1,
      habit_id: 1,
      achievement_type: "streak_completed",
      target_days: 30,
      achieved_at: "2025-01-10T06:30:00Z",
      metadata: {
        streak_id: 1,
        habit_name: "Morning Meditation"
      }
    }
  ],
  most_consistent_habit: {
    habit_id: 1,
    habit_name: "Morning Meditation",
    consistency_rate: 95,
    current_streak: 18,
    total_check_ins: 42,
    last_check_in: "2025-01-31T06:30:00Z"
  },
  improvement_trend: "improving"
};

// Complete API response format
export const dummyProfileResponse: UserProfileResponse = {
  success: true,
  message: "User profile fetched successfully",
  data: dummyProfileData
};

// Additional dummy data variations for different scenarios

// Beginner user with minimal data
export const beginnerProfileData: UserProfileData = {
  id: 2,
  email: "beginner@example.com",
  name: "Sarah Beginner",
  created_at: "2025-01-30T10:00:00.000Z",
  overview: {
    total_habits: 2,
    active_habits: 2,
    total_check_ins: 3,
    total_achievements: 0,
    days_since_joined: 3,
    overall_consistency: 50.0,
    weekly_consistency: 50.0,
    monthly_consistency: 50.0
  },
  streak_insights: {
    current_longest_streak: 2,
    best_streak_ever: 2,
    average_streak_length: 1.5,
    active_streaks_count: 1
  },
  consistency_chart: [
    {
      date: "2025-01-29T00:00:00Z",
      percentage: 50,
      check_ins: 1,
      total_habits: 2
    },
    {
      date: "2025-01-30T00:00:00Z",
      percentage: 100,
      check_ins: 2,
      total_habits: 2
    },
    {
      date: "2025-01-31T00:00:00Z",
      percentage: 0,
      check_ins: 0,
      total_habits: 2
    }
  ],
  top_habits: [
    {
      habit_id: 6,
      habit_name: "Drink Water",
      consistency_rate: 66,
      current_streak: 2,
      total_check_ins: 2,
      last_check_in: "2025-01-30T14:00:00Z"
    },
    {
      habit_id: 7,
      habit_name: "Walk 10 Minutes",
      consistency_rate: 33,
      current_streak: 0,
      total_check_ins: 1,
      last_check_in: "2025-01-29T16:30:00Z"
    }
  ],
  recent_achievements: [],
  most_consistent_habit: {
    habit_id: 6,
    habit_name: "Drink Water",
    consistency_rate: 66,
    current_streak: 2,
    total_check_ins: 2,
    last_check_in: "2025-01-30T14:00:00Z"
  },
  improvement_trend: "starting"
};

// Advanced user with high consistency
export const advancedProfileData: UserProfileData = {
  id: 3,
  email: "advanced@example.com", 
  name: "Mike Advanced",
  created_at: "2024-06-01T10:00:00.000Z",
  overview: {
    total_habits: 15,
    active_habits: 12,
    total_check_ins: 1450,
    total_achievements: 28,
    days_since_joined: 245,
    overall_consistency: 92.3,
    weekly_consistency: 95.8,
    monthly_consistency: 91.7
  },
  streak_insights: {
    current_longest_streak: 67,
    best_streak_ever: 89,
    average_streak_length: 28.4,
    active_streaks_count: 10
  },
  consistency_chart: [
    {
      date: "2025-01-25T00:00:00Z",
      percentage: 90,
      check_ins: 9,
      total_habits: 10
    },
    {
      date: "2025-01-26T00:00:00Z",
      percentage: 95,
      check_ins: 10,
      total_habits: 10
    },
    {
      date: "2025-01-27T00:00:00Z",
      percentage: 100,
      check_ins: 10,
      total_habits: 10
    },
    {
      date: "2025-01-28T00:00:00Z",
      percentage: 90,
      check_ins: 9,
      total_habits: 10
    },
    {
      date: "2025-01-29T00:00:00Z",
      percentage: 95,
      check_ins: 10,
      total_habits: 10
    },
    {
      date: "2025-01-30T00:00:00Z",
      percentage: 100,
      check_ins: 10,
      total_habits: 10
    },
    {
      date: "2025-01-31T00:00:00Z",
      percentage: 95,
      check_ins: 9,
      total_habits: 10
    }
  ],
  top_habits: [
    {
      habit_id: 8,
      habit_name: "Morning Routine",
      consistency_rate: 98,
      current_streak: 67,
      total_check_ins: 240,
      last_check_in: "2025-01-31T06:00:00Z"
    },
    {
      habit_id: 9,
      habit_name: "Workout",
      consistency_rate: 95,
      current_streak: 45,
      total_check_ins: 180,
      last_check_in: "2025-01-31T18:30:00Z"
    },
    {
      habit_id: 10,
      habit_name: "Healthy Eating",
      consistency_rate: 93,
      current_streak: 42,
      total_check_ins: 220,
      last_check_in: "2025-01-31T20:00:00Z"
    },
    {
      habit_id: 11,
      habit_name: "Meditation",
      consistency_rate: 91,
      current_streak: 38,
      total_check_ins: 200,
      last_check_in: "2025-01-31T21:30:00Z"
    },
    {
      habit_id: 12,
      habit_name: "Reading",
      consistency_rate: 88,
      current_streak: 25,
      total_check_ins: 185,
      last_check_in: "2025-01-31T22:15:00Z"
    }
  ],
  recent_achievements: [
    {
      id: 6,
      user_id: 3,
      habit_id: 8,
      achievement_type: "streak_completed",
      target_days: 60,
      achieved_at: "2025-01-25T06:00:00Z",
      metadata: {
        streak_id: 8,
        habit_name: "Morning Routine"
      }
    },
    {
      id: 7,
      user_id: 3,
      habit_id: 9,
      achievement_type: "streak_completed",
      target_days: 30,
      achieved_at: "2025-01-15T18:30:00Z",
      metadata: {
        streak_id: 9,
        habit_name: "Workout"
      }
    },
    {
      id: 8,
      user_id: 3,
      habit_id: 10,
      achievement_type: "streak_completed",
      target_days: 45,
      achieved_at: "2025-01-20T20:00:00Z",
      metadata: {
        streak_id: 10,
        habit_name: "Healthy Eating"
      }
    }
  ],
  most_consistent_habit: {
    habit_id: 8,
    habit_name: "Morning Routine",
    consistency_rate: 98,
    current_streak: 67,
    total_check_ins: 240,
    last_check_in: "2025-01-31T06:00:00Z"
  },
  improvement_trend: "consistent"
};

// Helper function to get random dummy data
export const getRandomProfileData = (): UserProfileData => {
  const profiles = [dummyProfileData, beginnerProfileData, advancedProfileData];
  return profiles[Math.floor(Math.random() * profiles.length)];
};

// Helper function to simulate API delay
export const getDummyProfileWithDelay = (delayMs: number = 1500): Promise<UserProfileResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyProfileResponse);
    }, delayMs);
  });
};
