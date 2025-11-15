import { useState, useEffect } from 'react';
import { UserProfile, CheckIn, Badge, BADGES, calculateLevel } from '@/types/game';
import { mockBars } from '@/data/mockBars';

const STORAGE_KEY = 'barquest_user_profile';

const defaultProfile: UserProfile = {
  id: 'user-1',
  name: 'Explorer',
  avatar: '🎮',
  points: 0,
  level: 1,
  checkIns: [],
  badges: BADGES,
};

export const useGameStore = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // Load profile from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
      } catch (error) {
        console.error('Failed to parse stored profile:', error);
      }
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const addCheckIn = (barId: string) => {
    const bar = mockBars.find(b => b.id === barId);
    if (!bar) return;

    const checkIn: CheckIn = {
      barId,
      barName: bar.name,
      timestamp: Date.now(),
      points: 10,
    };

    setProfile(prev => {
      const newPoints = prev.points + 10;
      const newLevel = calculateLevel(newPoints);
      const newCheckIns = [...prev.checkIns, checkIn];

      // Update badges
      const uniqueCheckins = new Set(newCheckIns.map(c => c.barId)).size;
      const barCheckins = newCheckIns.filter(c => {
        const b = mockBars.find(mb => mb.id === c.barId);
        return b?.type === 'bar';
      }).length;
      const restaurantCheckins = newCheckIns.filter(c => {
        const b = mockBars.find(mb => mb.id === c.barId);
        return b?.type === 'restaurant';
      }).length;
      const cafeCheckins = newCheckIns.filter(c => {
        const b = mockBars.find(mb => mb.id === c.barId);
        return b?.type === 'café';
      }).length;

      const updatedBadges = prev.badges.map(badge => {
        let progress = 0;
        
        switch (badge.id) {
          case 'first-check-in':
            progress = Math.min(newCheckIns.length, 1);
            break;
          case 'explorer':
            progress = uniqueCheckins;
            break;
          case 'social-butterfly':
            progress = uniqueCheckins;
            break;
          case 'bar-hopper':
            progress = barCheckins;
            break;
          case 'foodie':
            progress = restaurantCheckins;
            break;
          case 'coffee-lover':
            progress = cafeCheckins;
            break;
        }

        return {
          ...badge,
          progress,
          earned: progress >= badge.requirement,
        };
      });

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        checkIns: newCheckIns,
        badges: updatedBadges,
      };
    });
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateAvatar = (avatar: string) => {
    setProfile(prev => ({ ...prev, avatar }));
  };

  const updateName = (name: string) => {
    setProfile(prev => ({ ...prev, name }));
  };

  return {
    profile,
    addCheckIn,
    resetProfile,
    updateAvatar,
    updateName,
  };
};
