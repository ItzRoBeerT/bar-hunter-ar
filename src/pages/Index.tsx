import { useState } from 'react';
import { Menu, User, Trophy, MapIcon } from 'lucide-react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useGameStore } from '@/hooks/useGameStore';
import { MapView } from '@/components/MapView';
import { NearbyBarsList } from '@/components/NearbyBarsList';
import { UserProfile } from '@/components/UserProfile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { location, loading, error } = useUserLocation();
  const { profile } = useGameStore();
  const [showProfile, setShowProfile] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const handleBarClick = (barId: string) => {
    // This will be handled by the map markers directly
    console.log('Bar clicked:', barId);
  };

  const handleCenterUser = () => {
    // Trigger map re-center
    setMapKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading your location...</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-6">
        <div className="game-card p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-destructive">Location Error</h2>
          <p className="text-muted-foreground mb-4">
            {error || 'Unable to get your location. Please enable location services.'}
          </p>
          <p className="text-sm text-muted-foreground">
            Using default location: Madrid, Spain
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🍺</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            BarQuest
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span className="font-bold">{profile.points}</span>
          </Badge>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowProfile(true)}
            className="relative"
          >
            <User className="w-5 h-5" />
            <Badge 
              variant="default" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {profile.level}
            </Badge>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Map */}
        <div className="absolute inset-0">
          <MapView 
            key={mapKey}
            userLocation={location} 
            onCenterUser={handleCenterUser}
          />
        </div>

        {/* Mobile Sidebar Trigger */}
        <div className="absolute bottom-6 left-6 md:hidden z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg glow-effect">
                <MapIcon className="w-5 h-5 mr-2" />
                Nearby
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
              <div className="py-4">
                <NearbyBarsList 
                  userLocation={location} 
                  onBarClick={handleBarClick}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block absolute left-6 top-6 bottom-6 w-80 game-card p-4 overflow-y-auto">
          <NearbyBarsList 
            userLocation={location} 
            onBarClick={handleBarClick}
          />
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </div>
  );
};

export default Index;
