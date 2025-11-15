import { useMemo } from 'react';
import { MapPin, Star } from 'lucide-react';
import { mockBars } from '@/data/mockBars';
import { UserLocation } from '@/hooks/useUserLocation';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { Badge } from './ui/badge';

interface NearbyBarsListProps {
  userLocation: UserLocation;
  onBarClick: (barId: string) => void;
}

export const NearbyBarsList = ({ userLocation, onBarClick }: NearbyBarsListProps) => {
  const sortedBars = useMemo(() => {
    return mockBars
      .map(bar => ({
        ...bar,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          bar.coordinates[1],
          bar.coordinates[0]
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bar': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'restaurant': return 'bg-primary/20 text-primary border-primary/30';
      case 'café': return 'bg-accent/20 text-accent border-accent/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold px-1">Nearby Places</h3>
      <div className="space-y-2">
        {sortedBars.map(bar => (
          <button
            key={bar.id}
            onClick={() => onBarClick(bar.id)}
            className="w-full text-left game-card p-4 hover:bg-card/80 transition-colors game-button"
          >
            <div className="flex gap-3">
              <img
                src={bar.imageUrl}
                alt={bar.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold truncate">{bar.name}</h4>
                  <Badge variant="outline" className={`${getTypeColor(bar.type)} capitalize text-xs shrink-0`}>
                    {bar.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-secondary text-secondary" />
                    <span>{bar.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{formatDistance(bar.distance)}</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
