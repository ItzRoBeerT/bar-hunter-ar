import { useState, useCallback, useRef } from 'react';
import Map, { Marker, Layer, Source } from 'react-map-gl';
import { MapPin, Navigation, User } from 'lucide-react';
import { mockBars, Bar } from '@/data/mockBars';
import { UserLocation } from '@/hooks/useUserLocation';
import { BarDetailModal } from './BarDetailModal';
import { Button } from './ui/button';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  userLocation: UserLocation;
  onCenterUser: () => void;
}

export const MapView = ({ userLocation, onCenterUser }: MapViewProps) => {
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [viewState, setViewState] = useState({
    longitude: userLocation.longitude,
    latitude: userLocation.latitude,
    zoom: 14,
  });
  
  const mapRef = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState(() => {
    return localStorage.getItem('mapbox_token') || '';
  });

  const handleTokenSubmit = (token: string) => {
    localStorage.setItem('mapbox_token', token);
    setMapboxToken(token);
  };

  const handleBarClick = useCallback((bar: Bar) => {
    setSelectedBar(bar);
  }, []);

  const handleCenterUser = useCallback(() => {
    setViewState({
      longitude: userLocation.longitude,
      latitude: userLocation.latitude,
      zoom: 15,
    });
    onCenterUser();
  }, [userLocation, onCenterUser]);

  // Create circle data for check-in range (50m radius)
  const createCircle = (center: [number, number], radiusInMeters: number) => {
    const points = 64;
    const km = radiusInMeters / 1000;
    const ret = [];
    const distanceX = km / (111.32 * Math.cos((center[1] * Math.PI) / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      ret.push([center[0] + x, center[1] + y]);
    }
    ret.push(ret[0]);

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ret],
      },
    };
  };

  const circleData = {
    type: 'FeatureCollection',
    features: [createCircle([userLocation.longitude, userLocation.latitude], 50)],
  };

  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="game-card p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-primary">Setup Required</h2>
          <p className="text-muted-foreground mb-6">
            To use the map, you'll need a Mapbox access token. Get your free token at{' '}
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <input
            type="text"
            placeholder="Paste your Mapbox token here"
            className="w-full px-4 py-3 bg-input border border-border rounded-lg mb-4 text-foreground"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                handleTokenSubmit(e.currentTarget.value);
              }
            }}
          />
          <Button
            onClick={() => {
              const input = document.querySelector('input') as HTMLInputElement;
              if (input?.value) {
                handleTokenSubmit(input.value);
              }
            }}
            className="w-full"
          >
            Save Token
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Check-in range circle */}
        <Source id="check-in-range" type="geojson" data={circleData as any}>
          <Layer
            id="check-in-range-fill"
            type="fill"
            paint={{
              'fill-color': 'hsl(142, 76%, 36%)',
              'fill-opacity': 0.2,
            }}
          />
          <Layer
            id="check-in-range-outline"
            type="line"
            paint={{
              'line-color': 'hsl(142, 76%, 36%)',
              'line-width': 2,
              'line-opacity': 0.6,
            }}
          />
        </Source>

        {/* User marker */}
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
          anchor="center"
        >
          <div className="relative animate-bounce-subtle">
            <div className="absolute inset-0 bg-primary rounded-full blur-lg opacity-60" />
            <div className="relative bg-primary text-primary-foreground rounded-full p-3 shadow-lg border-4 border-background">
              <User className="w-6 h-6" />
            </div>
          </div>
        </Marker>

        {/* Bar markers */}
        {mockBars.map((bar) => (
          <Marker
            key={bar.id}
            longitude={bar.coordinates[0]}
            latitude={bar.coordinates[1]}
            anchor="bottom"
          >
            <button
              onClick={() => handleBarClick(bar)}
              className="relative group cursor-pointer transition-transform hover:scale-110 game-button"
            >
              <div className="absolute -inset-2 bg-secondary rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative bg-secondary text-secondary-foreground rounded-full p-2 shadow-lg border-2 border-background">
                <MapPin className="w-6 h-6" fill="currentColor" />
              </div>
            </button>
          </Marker>
        ))}
      </Map>

      {/* Center on user button */}
      <Button
        onClick={handleCenterUser}
        className="absolute bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg glow-effect"
        size="icon"
      >
        <Navigation className="w-6 h-6" />
      </Button>

      {/* Bar detail modal */}
      {selectedBar && (
        <BarDetailModal
          bar={selectedBar}
          userLocation={userLocation}
          onClose={() => setSelectedBar(null)}
        />
      )}
    </div>
  );
};
