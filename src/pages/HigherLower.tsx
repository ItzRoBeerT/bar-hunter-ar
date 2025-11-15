import React, { useState, useCallback } from "react";
import {
  RefreshCcw,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Card {
  name: string;
  value: number;
  url: string;
}

interface HigherLowerProps {
  onGameEnd?: () => void;
}

type GameState = "waitingForBet" | "showingResult" | "gameOver";
type BetType = "higher" | "lower";

// ============================================================================
// CONSTANTS
// ============================================================================

const SPANISH_DECK: Card[] = [
  {
    name: "As de Oros",
    value: 1,
    url: "https://images-ext-1.discordapp.net/external/DolmilNTQ-Rzp_Fnp4tf6MvRFPUExFguHhi4tIIQAYA/https/www.profedeele.es/wp-content/uploads/h5p/content/1873/images/image-5fbe26415a8bd.png?format=webp&quality=lossless&width=520&height=800",
  },
  {
    name: "Tres de Copas",
    value: 3,
    url: "https://imgs.search.brave.com/IR0EgivhKVKIzO7aWVA0Ol-ZE6vDoT9AugnwsVMNjWA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2ZjL2I1/L2JlL2ZjYjViZTNl/NGE5ODA0OWIyZTkz/ZGM4OGMwMGQyYmRj/LmpwZw",
  },
  {
    name: "Seis de Copas",
    value: 6,
    url: "https://imgs.search.brave.com/fL-rqBuLge1uxQlyi-D5RmQZUS5B3x38oS5IR_vJIcs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vp/UHJEVFR5QjBoUWVf/U1pxcENTakRGVTNE/cnhxOVAwbTJDZDVa/TlBUUWRHVW9naC1w/ZXV6VjlKRmI2Y3cy/TGtMdExmSEpKUWRR/czNwUXVMWGYwWTFD/SWhlQm9BUThNeXN5/UjZmbzVTTko4WGk2/UWdXcXZkSWNNWm5B/dzZEV3d2ZUxMbVdq/TGFVaWEvczQwMC8w/NmNfLmpwZw",
  },
  {
    name: "Siete de Espadas",
    value: 7,
    url: "https://imgs.search.brave.com/X54ac0DVpkK0nn2_tce0PLnXvT6WUOO_MVnB1ZnCD_o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzliLzMx/L2Q1LzliMzFkNWMx/MjFjMjM4NmYxMmI3/MmNhNTJjZDViNDFm/LmpwZw",
  },
  {
    name: "Sota de Oros",
    value: 10,
    url: "https://imgs.search.brave.com/c4MM5wdlPmEXjloQfx626LL40Pg3XBG204Q-H4DiWUE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bGFndWlhZGVsdGFy/b3QuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzEyL3Nv/dGEtMy5wbmcud2Vi/cA",
  },
  {
    name: "Caballo de Oros",
    value: 11,
    url: "https://imgs.search.brave.com/8ue6YIYdJT8y542TlwWkx-MwQVCIesnxuoqvmT1tFq8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bGFndWlhZGVsdGFy/b3QuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzEyL2Nh/YmFsbG8tMy5wbmcu/d2VicA",
  },
  {
    name: "Rey de Bastos",
    value: 12,
    url: "https://imgs.search.brave.com/Q-Qde08o0YqTLTPrOg5bchHf69YqzeLRWpzA2PysSfs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bGFndWlhZGVsdGFy/b3QuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzEyL3Jl/eS00LnBuZy53ZWJw",
  },
];

const FLIP_ANIMATION_DURATION = 500;
const RESULT_DISPLAY_DURATION = 3000;

const SOUND_PATHS = {
  flip: "/sounds/flipcard.mp3",
  drink: "/sounds/cerveza_bote.mp3",
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Simple toast replacement
const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600'
  };
  
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
  toast.textContent = message;
  toast.style.animation = 'slideIn 0.3s ease-out';
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

const createShuffledDeck = (): Card[] => {
  const deck = [...SPANISH_DECK];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const playSound = (path: string, volume: number = 0.6): void => {
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch((error) => console.error("Error al reproducir audio:", error));
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const CardImage: React.FC<{ card: Card | null; isBackVisible?: boolean }> = ({ 
  card, 
  isBackVisible = false 
}) => {
  if (!card || isBackVisible) {
    return (
      <img 
        src="/cards/reverse.png" 
        alt="Card Back" 
        className="card-image"
      />
    );
  }

  return (
    <img
      src={card.url}
      alt={card.name}
      className="card-image"
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = "none";
        const container = target.parentElement;
        if (container && !container.querySelector(".fallback-text")) {
          const fallback = document.createElement("span");
          fallback.className = "card-fallback fallback-text";
          fallback.textContent = card.name;
          container.appendChild(fallback);
        }
      }}
    />
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const HigherLower: React.FC<HigherLowerProps> = ({ onGameEnd }) => {
  // Initialize game immediately on component mount
  const initialDeck = createShuffledDeck();
  const [firstCard, ...remainingCards] = initialDeck;

  // Game state
  const [deck, setDeck] = useState<Card[]>(remainingCards);
  const [currentCard, setCurrentCard] = useState<Card>(firstCard);
  const [nextCard, setNextCard] = useState<Card | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameState, setGameState] = useState<GameState>("waitingForBet");
  const [lastOutcomeMessage, setLastOutcomeMessage] = useState("¿Más alta o más baja?");

  // ============================================================================
  // GAME CONTROL
  // ============================================================================

  const startNewGame = useCallback(() => {
    const shuffledDeck = createShuffledDeck();
    const [firstCard, ...remainingDeck] = shuffledDeck;

    if (!firstCard) {
      showToast("Error al iniciar el mazo. Reintentando...", "error");
      return;
    }

    setDeck(remainingDeck);
    setCurrentCard(firstCard);
    setNextCard(null);
    setIsFlipping(false);
    setGameState("waitingForBet");
    setLastOutcomeMessage("¿Más alta o más baja?");

    showToast("¡Juego iniciado! ¡A la suerte y al trago!", "info");
  }, []);

  // ============================================================================
  // GAME LOGIC
  // ============================================================================

  const evaluateBet = useCallback((
    betType: BetType,
    currentCardValue: number,
    drawnCardValue: number
  ): { outcome: string; playerDrinks: boolean; everyoneDrinks: boolean } => {
    if (drawnCardValue === currentCardValue) {
      return {
        outcome: `¡IGUALES! ¡TODOS BEBEN! 🥂`,
        playerDrinks: false,
        everyoneDrinks: true,
      };
    }

    const isCorrect = betType === "higher" 
      ? drawnCardValue > currentCardValue 
      : drawnCardValue < currentCardValue;

    const outcome = isCorrect
      ? `¡ACIERTO! ¡No bebes!`
      : `¡FALLO! ¡Bebes!`;

    return {
      outcome,
      playerDrinks: !isCorrect,
      everyoneDrinks: false,
    };
  }, []);

  const advanceTurn = useCallback((prevDrawnCard: Card) => {
    setCurrentCard(prevDrawnCard);
    setNextCard(null);

    if (deck.length === 0) {
      setGameState("gameOver");
      setLastOutcomeMessage("¡Se acabó el mazo! Juego finalizado.");
      onGameEnd?.();
      return;
    }

    setGameState("waitingForBet");
    setLastOutcomeMessage("¿Más alta o más baja?");
  }, [deck.length, onGameEnd]);

  const handleBet = useCallback((betType: BetType) => {
    if (gameState !== "waitingForBet" || deck.length === 0 || isFlipping) {
      return;
    }

    const [drawnCard, ...newDeck] = deck;

    if (!drawnCard) {
      showToast("¡No quedan cartas! El juego ha terminado.", "error");
      setGameState("gameOver");
      return;
    }

    setDeck(newDeck);
    setIsFlipping(true);
    playSound(SOUND_PATHS.flip);

    setTimeout(() => {
      setNextCard(drawnCard);
      setIsFlipping(false);
      setGameState("showingResult");

      const { outcome, playerDrinks, everyoneDrinks } = evaluateBet(
        betType,
        currentCard.value,
        drawnCard.value
      );

      setLastOutcomeMessage(outcome);

      if (everyoneDrinks) {
        playSound(SOUND_PATHS.drink, 0.7);
        showToast("¡Todos a beber! ¡Por el buen rollo!", "info");
      } else if (playerDrinks) {
        playSound(SOUND_PATHS.drink, 0.7);
        showToast("¡Te toca beber!", "warning");
      } else {
        showToast("¡Bien! ¡No bebes esta vez!", "success");
      }

      setTimeout(() => advanceTurn(drawnCard), RESULT_DISPLAY_DURATION);
    }, FLIP_ANIMATION_DURATION);
  }, [
    gameState,
    deck,
    isFlipping,
    currentCard,
    evaluateBet,
    advanceTurn,
  ]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .card-flip {
          perspective: 1000px;
          width: 128px;
          height: 176px;
        }
        
        .card-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.5s ease-in-out;
          transform-style: preserve-3d;
        }
        
        .card-flip.flipping .card-flip-inner {
          transform: rotateY(180deg);
        }
        
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          overflow: hidden;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .card-back {
          transform: rotateY(180deg);
        }
        
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }
        
        .card-fallback {
          color: #60a5fa;
          font-size: 0.875rem;
          font-weight: bold;
          padding: 8px;
          text-align: center;
          word-break: break-word;
          line-height: 1.2;
          background: linear-gradient(135deg, #374151, #4b5563);
          border: 2px solid #6b7280;
          border-radius: 12px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 text-center">
          🍻 Alto o Bajo 🍻
        </h1>

        {gameState === "gameOver" ? (
          <div className="text-center bg-gray-800/90 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-yellow-400">
              ¡Juego Terminado!
            </h2>
            <p className="text-xl mb-8 text-gray-200">{lastOutcomeMessage}</p>
            <button
              type="button"
              onClick={startNewGame}
              className="bg-green-600 hover:bg-green-700 text-white inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              <RefreshCcw className="mr-2" size={20} /> Jugar de Nuevo
            </button>
          </div>
        ) : (
          <>
          <p className="text-gray-300 pb-8 text-center">Elige si la siguiente carta es más alta o más baja que la actual</p>
            
            <div className="mb-8 text-center bg-gray-800/90 rounded-xl p-6 border border-gray-700">
              
              <p className="text-gray-300 mb-2">Cartas restantes:</p>
              <p className="font-bold text-2xl text-yellow-300">{deck.length}</p>
            </div>

            <div className="mb-8 flex justify-center items-center gap-6">
              <div className="relative w-32 h-44">
                <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl shadow-2xl flex items-center justify-center border-2 border-gray-600 overflow-hidden">
                  <CardImage card={currentCard} />
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-300">
                  Actual
                </div>
              </div>

              <div className="text-2xl font-bold text-yellow-400">VS</div>

              <div className="relative">
                <div className={`card-flip ${isFlipping ? "flipping" : ""}`}>
                  <div className="card-flip-inner">
                    <div className="card-face">
                      <CardImage card={nextCard} />
                    </div>
                    <div className="card-face card-back">
                      <CardImage card={null} isBackVisible />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-300">
                  {gameState === "waitingForBet" ? "Siguiente" : "Resultado"}
                </div>
              </div>
            </div>

            {gameState === "showingResult" && (
              <div className="mb-6 bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-gray-600 text-center">
                <p className="text-xl font-semibold text-yellow-300">
                  {lastOutcomeMessage}
                </p>
              </div>
            )}

            {gameState === "waitingForBet" && !isFlipping && (
              <div className="flex gap-4 mb-8 justify-center">
                <button
                  type="button"
                  onClick={() => handleBet("higher")}
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg transition-all inline-flex items-center font-bold hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ArrowUp className="mr-3" size={24} /> ¡Más Alta!
                </button>
                <button
                  type="button"
                  onClick={() => handleBet("lower")}
                  className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg transition-all inline-flex items-center font-bold hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ArrowDown className="mr-3" size={24} /> ¡Más Baja!
                </button>
              </div>
            )}

            {isFlipping && (
              <div className="mb-8 text-center">
                <p className="text-lg text-yellow-300 animate-pulse">
                  Revelando carta...
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-4 mt-auto">
        <button
          type="button"
          onClick={startNewGame}
          className="bg-yellow-600 hover:bg-yellow-700 text-white inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
        >
          <RefreshCcw className="mr-2" size={18} /> Nuevo Mazo
        </button>
      </div>
    </div>
  );
};