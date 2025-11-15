export interface Player {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  checkIns: CheckIn[];
  badges: Badge[];
}

export interface CheckIn {
  barId: string;
  barName: string;
  timestamp: number;
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  requirement: number;
  progress: number;
}

export const BADGES: Badge[] = [
  {
    id: 'first-check-in',
    name: 'First Steps',
    description: 'Complete your first check-in',
    icon: '🎯',
    earned: false,
    requirement: 1,
    progress: 0
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Check in to 5 different locations',
    icon: '🗺️',
    earned: false,
    requirement: 5,
    progress: 0
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Check in to 10 different locations',
    icon: '🦋',
    earned: false,
    requirement: 10,
    progress: 0
  },
  {
    id: 'bar-hopper',
    name: 'Bar Hopper',
    description: 'Check in to 5 bars',
    icon: '🍺',
    earned: false,
    requirement: 5,
    progress: 0
  },
  {
    id: 'foodie',
    name: 'Foodie',
    description: 'Check in to 5 restaurants',
    icon: '🍽️',
    earned: false,
    requirement: 5,
    progress: 0
  },
  {
    id: 'coffee-lover',
    name: 'Coffee Lover',
    description: 'Check in to 3 cafés',
    icon: '☕',
    earned: false,
    requirement: 3,
    progress: 0
  }
];

export const calculateLevel = (points: number): number => {
  return Math.floor(points / 100) + 1;
};

export const getPointsForNextLevel = (currentLevel: number): number => {
  return currentLevel * 100;
};
