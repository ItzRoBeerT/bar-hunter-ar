import { useState } from 'react';
import { X, MapPin, Star, CheckCircle, Navigation as NavigationIcon } from 'lucide-react';
import { Bar } from '@/data/mockBars';
import { UserLocation } from '@/hooks/useUserLocation';
import { calculateDistance, formatDistance, isWithinCheckInRange } from '@/utils/distance';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface BarDetailModalProps {
  bar: Bar;
  userLocation: UserLocation;
  onClose: () => void;
}

export const BarDetailModal = ({ bar, userLocation, onClose }: BarDetailModalProps) => {
  const { profile, addCheckIn } = useGameStore();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const navigate = useNavigate();
  
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    bar.coordinates[1],
    bar.coordinates[0]
  );
  
  const canCheckIn = isWithinCheckInRange(
    userLocation.latitude,
    userLocation.longitude,
    bar.coordinates[1],
    bar.coordinates[0]
  );

  const hasCheckedIn = profile.checkIns.some(checkIn => checkIn.barId === bar.id);

  const handleCheckIn = () => {
    if (!canCheckIn) {
      toast.error('You need to be within 50m to check in!');
      return;
    }

    setIsCheckingIn(true);
    
    // Navigate to game screen on check-in
    navigate(`/game/${bar.id}`);
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bar.coordinates[1]},${bar.coordinates[0]}`;
    window.open(url, '_blank');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bar': return 'bg-secondary text-secondary-foreground';
      case 'restaurant': return 'bg-primary text-primary-foreground';
      case 'café': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl slide-in-up overflow-hidden border border-border">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img
            src={bar.imageUrl}
            alt={bar.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Type badge */}
          <Badge className={`absolute top-4 left-4 ${getTypeColor(bar.type)} capitalize`}>
            {bar.type}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title and rating */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{bar.name}</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(bar.rating)
                        ? 'fill-secondary text-secondary'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {bar.rating} / 5
              </span>
            </div>
          </div>

          {/* Distance */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{formatDistance(distance)} away</span>
          </div>

          {/* Address */}
          <p className="text-sm text-muted-foreground">{bar.address}</p>

          {/* Description */}
          <p className="text-sm">{bar.description}</p>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleCheckIn}
              disabled={!canCheckIn || hasCheckedIn || isCheckingIn}
              className={`flex-1 ${isCheckingIn ? 'animate-check-in-pulse' : ''}`}
              variant={canCheckIn && !hasCheckedIn ? 'default' : 'secondary'}
            >
              {isCheckingIn ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
                  Checking in...
                </>
              ) : hasCheckedIn ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Checked in
                </>
              ) : !canCheckIn ? (
                `Too far (${formatDistance(distance)})`
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check in
                </>
              )}
            </Button>
            
            <Button
              onClick={handleGetDirections}
              variant="outline"
              size="icon"
              className="w-12"
            >
              <NavigationIcon className="w-4 h-4" />
            </Button>

            {/* Ruleta game button */}
            <Button
              onClick={() => navigate(`/ruleta/${bar.id}`)}
              variant="secondary"
              className="ml-2"
            >
              Juego de la ruleta
            </Button>
          </div>

          {!canCheckIn && (
            <p className="text-xs text-muted-foreground text-center">
              Get within 50m to check in and earn 10 points!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
