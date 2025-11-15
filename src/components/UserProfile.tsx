import { X, Trophy, Target, Award } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { getPointsForNextLevel } from '@/types/game';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface UserProfileProps {
  onClose: () => void;
}

export const UserProfile = ({ onClose }: UserProfileProps) => {
  const { profile } = useGameStore();
  
  const nextLevelPoints = getPointsForNextLevel(profile.level);
  const currentLevelProgress = profile.points % 100;
  const progressPercentage = (currentLevelProgress / 100) * 100;

  const earnedBadges = profile.badges.filter(b => b.earned);
  const unearnedBadges = profile.badges.filter(b => !b.earned);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full sm:max-w-2xl bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl slide-in-up overflow-hidden border border-border max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-primary via-accent to-secondary p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-background/20 backdrop-blur-sm border-4 border-background flex items-center justify-center text-4xl">
              {profile.avatar}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Trophy className="w-4 h-4" />
                <span>Level {profile.level} Explorer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="game-card p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {profile.points}
              </div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
            <div className="game-card p-4 text-center">
              <div className="text-3xl font-bold text-secondary mb-1">
                {profile.checkIns.length}
              </div>
              <div className="text-xs text-muted-foreground">Check-ins</div>
            </div>
            <div className="game-card p-4 text-center">
              <div className="text-3xl font-bold text-accent mb-1">
                {earnedBadges.length}
              </div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="game-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Level Progress</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {currentLevelProgress}/{100} XP
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {100 - currentLevelProgress} points to level {profile.level + 1}
            </p>
          </div>

          {/* Badges */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold">Achievements</h3>
            </div>
            
            {earnedBadges.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Earned</h4>
                <div className="grid grid-cols-2 gap-3">
                  {earnedBadges.map(badge => (
                    <div key={badge.id} className="game-card p-4">
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="text-sm font-semibold mb-1">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {badge.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unearnedBadges.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Locked</h4>
                <div className="grid grid-cols-2 gap-3">
                  {unearnedBadges.map(badge => (
                    <div key={badge.id} className="game-card p-4 opacity-50">
                      <div className="text-3xl mb-2 grayscale">{badge.icon}</div>
                      <div className="text-sm font-semibold mb-1">{badge.name}</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {badge.description}
                      </div>
                      <Progress 
                        value={(badge.progress / badge.requirement) * 100} 
                        className="h-1"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {badge.progress}/{badge.requirement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Check-ins */}
          {profile.checkIns.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Check-ins</h3>
              <div className="space-y-2">
                {profile.checkIns.slice(-5).reverse().map((checkIn, index) => (
                  <div key={index} className="game-card p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{checkIn.barName}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(checkIn.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="secondary">+{checkIn.points} pts</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
