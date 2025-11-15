import { useState, useEffect } from 'react';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      // Default to Madrid center if geolocation not supported
      setLocation({ latitude: 40.4168, longitude: -3.7038 });
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setError(null);
      setLoading(false);
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setError(error.message);
      setLoading(false);
      // Default to Madrid center if permission denied
      setLocation({ latitude: 40.4168, longitude: -3.7038 });
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });

    // Watch position for updates
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const simulateMovement = (targetLat: number, targetLng: number) => {
    if (!location) return;

    const steps = 20;
    const latStep = (targetLat - location.latitude) / steps;
    const lngStep = (targetLng - location.longitude) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(interval);
        return;
      }

      setLocation(prev => prev ? {
        latitude: prev.latitude + latStep,
        longitude: prev.longitude + lngStep,
        accuracy: prev.accuracy,
      } : null);

      currentStep++;
    }, 100);

    return () => clearInterval(interval);
  };

  return { location, error, loading, simulateMovement };
};
