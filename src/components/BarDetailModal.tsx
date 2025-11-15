import { useState, useRef } from 'react'; // Import useRef for the audio element
import { X, MapPin, Star, CheckCircle, Navigation as NavigationIcon, Volume2 } from 'lucide-react'; // Added Volume2 icon
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

const spanishBarJokes = [
  "¿Qué le dice una copa a otra? '¡Qué calor hace aquí!'",
  "Un día me hice un análisis de sangre y me salió que tenía alcohol en la sangre... ¡y cerveza en el alma!",
  "¿Cuál es el colmo de un cervecero? Que le dé alergia al lúpulo.",
  "Estaba en el bar y le digo al camarero: 'Ponme una cerveza, por favor'. Y me dice: '¿Fría?'. Le digo: 'No, ponme la que tengas, que ya me encargo yo de enfriarla'.",
  "Mi médico me ha dicho que tengo que beber más agua. Así que voy al bar y pido una cerveza, que tiene un 90% de agua. ¡Salud!",
  "¿Sabes por qué los del bar son los mejores futbolistas? Porque siempre están 'dando la copa'.",
  "En un bar: 'Camarero, ¿tiene ranas?'. 'No'. 'Pues traiga dos cañas, que la sed me mata'.",
  "¿Por qué los camareros son tan buenos en matemáticas? Porque saben sacar la cuenta perfectamente."
];

const getBarJoke = (barId: string) => {
  let hash = 0;
  for (let i = 0; i < barId.length; i++) {
    hash = barId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % spanishBarJokes.length;
  return spanishBarJokes[index];
};

export const BarDetailModal = ({ bar, userLocation, onClose }: BarDetailModalProps) => {
  const { profile, addCheckIn } = useGameStore();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isPlayingJoke, setIsPlayingJoke] = useState(false); // New state for playing status
  const audioRef = useRef<HTMLAudioElement>(null); // Ref for the audio element
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

  const barJoke = getBarJoke(bar.id);

  const handleCheckIn = () => {
    if (!canCheckIn) {
      toast.error('¡Necesitas estar a menos de 50m para fichar!');
      return;
    }

    setIsCheckingIn(true);
    navigate(`/game/${bar.id}`);
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bar.coordinates[1]},${bar.coordinates[0]}`;
    window.open(url, '_blank');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bar': return 'bg-yellow-500 text-black font-semibold';
      case 'restaurant': return 'bg-primary text-primary-foreground';
      case 'café': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // --- NEW: Function to handle playing the joke audio ---
  const playJokeAudio = async () => {
    if (isPlayingJoke) return; // Prevent multiple clicks
    setIsPlayingJoke(true);

    // --- IMPORTANT: This is where you'd integrate your TTS service or fetch audio ---
    // For demonstration, we'll simulate fetching an audio URL.
    // In a real app, you'd call your backend/TTS API here.
    try {
      // Example: If you have pre-generated audio files named after joke hashes:
      // const audioUrl = `/audio/jokes/${bar.id}.mp3`;
      
      // OR, if using a TTS API:
      // const response = await fetch('/api/text-to-speech', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: barJoke, voice: 'spanish-charismatic' })
      // });
      // const data = await response.json();
      // const audioUrl = data.audioUrl;

      // For this example, we'll use a placeholder and console log the joke.
      // You'd replace this with the actual URL from your TTS service or CDN.
      const simulatedAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Placeholder audio
      console.log(`Simulando reproducción del chiste: "${barJoke}"`);
      console.log(`URL de audio simulada: ${simulatedAudioUrl}`);

      if (audioRef.current) {
        audioRef.current.src = simulatedAudioUrl;
        audioRef.current.load(); // Load the new audio source
        await audioRef.current.play(); // Play the audio
        audioRef.current.onended = () => setIsPlayingJoke(false); // Reset state when audio ends
      } else {
        setIsPlayingJoke(false);
      }
    } catch (error) {
      console.error("Error al reproducir el chiste:", error);
      toast.error('No se pudo reproducir el chiste. ¡Inténtalo de nuevo!');
      setIsPlayingJoke(false);
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
      <div className="relative w-full sm:max_w-lg bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl slide-in-up overflow-hidden border border-border">
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
            {bar.type === 'bar' ? 'Cervecería' : bar.type}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{bar.name}</h2>
          </div>


          {/* Distance */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">¡A {formatDistance(distance)} de tus cañas!</span>
          </div>

          {/* Address */}
          <p className="text-sm text-muted-foreground">{bar.address}</p>

          {/* --- UPDATED: Description with the unique joke and audio button --- */}
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm italic text-gray-700 dark:text-gray-300 flex-1 mr-2">
              "{barJoke}"
            </p>
            <Button
              onClick={playJokeAudio}
              disabled={isPlayingJoke} // Disable while audio is playing
              variant="ghost"
              size="icon"
              className="w-10 h-10 flex-shrink-0"
            >
              {isPlayingJoke ? (
                <span className="animate-pulse">🎶</span> // Simple animation/indicator
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Hidden audio element */}
          <audio ref={audioRef} preload="auto" />

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
                  ¡Fichando...!
                </>
              ) : hasCheckedIn ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  ¡Ya has fichado aquí!
                </>
              ) : !canCheckIn ? (
                `Demasiado lejos (${formatDistance(distance)})`
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  ¡Fichar y a por la birra!
                </>
              )}
            </Button>
          </div>

          
        </div>
      </div>
    </div>
  );
};