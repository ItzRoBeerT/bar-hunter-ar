import React, { useState } from "react";
import { toast } from "sonner"; // For notifications
import {
  RefreshCcw,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Play,
} from "lucide-react"; // Added Plus, Trash2, Play icons

// --- Spanish Deck Definition ---
const SPANISH_DECK = [
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
    url: "https://imgs.search.brave.com/fL-rqBuLge1uxQlyi-D5RmQZUS5B3x38oS5IR_vJIcs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vp/UHNEVFR5QjBoUWVf/U1pxcENTakRGVTNE/cnhxOVAwbTJDZDVa/TlBUUWRHVW9naC1w/ZXV6VjlKRmI2Y3cy/TGtMdExmSEpKUWRR/czNwUXVMWGYwWTFD/SWhlQm9BUThNeXN5/UjZmbzVTTko4WGk2/UWdXcXZkSWNNWm5B/dzZEV3d2ZUxMbVdq/TGFVaWEvczQwMC8w/NmNfLmpwZw",
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

// --- Helper Functions for the Card Deck ---

// Card interface
interface Card {
  name: string;
  value: number;
  url: string;
}

// Create deck using the Spanish cards (for testing)
const createDeck = (): Card[] => {
  return [...SPANISH_DECK];
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]; // Swap
  }
  return newDeck;
};

// --- Player Interface (simplified for this game) ---
interface Player {
  id: string;
  name: string;
}

interface HigherLowerProps {
  onGameEnd?: () => void; // Optional callback when the game ends
}

export const HigherLower = ({ onGameEnd }: HigherLowerProps) => {
  // Player management state
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [gamePhase, setGamePhase] = useState<"setup" | "playing">("setup");

  // Game state
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [nextCard, setNextCard] = useState<Card | null>(null); // This will hold the *revealed* card for a moment
  const [isFlipping, setIsFlipping] = useState(false); // Animation state for card flipping
  const [playerTurnIndex, setPlayerTurnIndex] = useState(0);
  const [gameState, setGameState] = useState<
    "initial" | "waitingForBet" | "showingResult" | "gameOver"
  >("initial");
  const [lastOutcomeMessage, setLastOutcomeMessage] = useState<string>("");

  // Sound functions
  const playFlipSound = () => {
    const audio = new Audio("/sounds/destapar_cerveza.mp3");
    audio.volume = 0.6;
    audio
      .play()
      .catch((error) => console.error("Error al reproducir audio:", error));
  };

  const playLoserSound = () => {
    const audio = new Audio("/sounds/cerveza_bote.mp3");
    audio.volume = 0.7;
    audio
      .play()
      .catch((error) => console.error("Error al reproducir audio:", error));
  };

  // Add a new player
  const addPlayer = () => {
    if (newPlayerName.trim() === "") {
      toast.error("¡El nombre no puede estar vacío!");
      return;
    }
    if (
      players.some(
        (player) => player.name.toLowerCase() === newPlayerName.toLowerCase()
      )
    ) {
      toast.error("¡Ya existe un jugador con ese nombre!");
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      name: newPlayerName.trim(),
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName("");
    toast.success(`¡${newPlayer.name} se ha unido al juego!`);
  };

  // Remove a player
  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((player) => player.id !== playerId));
  };

  // Start the actual game
  const startGameWithPlayers = () => {
    if (players.length < 2) {
      toast.error("¡Necesitas al menos 2 jugadores para empezar!");
      return;
    }
    setGamePhase("playing");
    startGame();
  };

  // Reset everything to setup phase
  const resetToSetup = () => {
    setGamePhase("setup");
    setGameState("initial");
    setDeck([]);
    setCurrentCard(null);
    setNextCard(null);
    setIsFlipping(false);
    setPlayerTurnIndex(0);
    setLastOutcomeMessage("");
  };

  // Initialize or reset the game
  const startGame = () => {
    const newDeck = shuffleDeck(createDeck());
    const firstCard = newDeck[0];
    const remainingDeck = newDeck.slice(1);

    if (firstCard) {
      setDeck(remainingDeck);
      setCurrentCard(firstCard);
      setNextCard(null); // Ensure nextCard is null at the start of a new game
      setIsFlipping(false);
      setPlayerTurnIndex(0);
      setGameState("waitingForBet");
      setLastOutcomeMessage("¡Empieza la ronda! ¿Más alta o más baja?");
      toast.info("¡Juego iniciado! ¡A la suerte y al trago!");
    } else {
      toast.error("Error al iniciar el mazo. Reintentando...");
      setGameState("initial");
    }
  };

  // Function to get card name for display
  const getCardName = (card: Card | null): string => {
    if (card === null) return "?";
    return card.name;
  };

  const currentPlayer = players[playerTurnIndex];

  const handleBet = (betType: "higher" | "lower") => {
    if (gameState !== "waitingForBet" || deck.length === 0 || isFlipping)
      return;

    const drawnCard = deck[0];
    const newDeck = deck.slice(1);

    if (!drawnCard) {
      toast.error("¡No quedan cartas! El juego ha terminado.");
      setGameState("gameOver");
      return;
    }

    setDeck(newDeck);
    setIsFlipping(true);

    // Play flip sound and start animation
    playFlipSound();

    // After flip animation completes, show the result
    setTimeout(() => {
      setNextCard(drawnCard);
      setIsFlipping(false);
      setGameState("showingResult");

      let outcome = "";
      let playerDrinks = false;
      let everyoneDrinks = false;

      if (currentCard === null) {
        outcome = "Error en la carta actual.";
        playerDrinks = true;
      } else if (drawnCard.value === currentCard.value) {
        outcome = `¡IGUALES (${getCardName(currentCard)})! ¡TODOS BEBEN! 🥂`;
        everyoneDrinks = true;
        playLoserSound(); // Everyone drinks sound
      } else if (betType === "higher") {
        if (drawnCard.value > currentCard.value) {
          outcome = `¡ACIERTO! (${getCardName(currentCard)} < ${getCardName(
            drawnCard
          )}) ¡No bebes!`;
        } else {
          outcome = `¡FALLO! (${getCardName(currentCard)} > ${getCardName(
            drawnCard
          )}) ¡Bebes!`;
          playerDrinks = true;
          playLoserSound(); // Player drinks sound
        }
      } else if (betType === "lower") {
        if (drawnCard.value < currentCard.value) {
          outcome = `¡ACIERTO! (${getCardName(currentCard)} > ${getCardName(
            drawnCard
          )}) ¡No bebes!`;
        } else {
          outcome = `¡FALLO! (${getCardName(currentCard)} < ${getCardName(
            drawnCard
          )}) ¡Bebes!`;
          playerDrinks = true;
          playLoserSound(); // Player drinks sound
        }
      }

      setLastOutcomeMessage(outcome);

      if (everyoneDrinks) {
        toast.info("¡Todos a beber! ¡Por el buen rollo!");
      } else if (playerDrinks) {
        toast.warning(`${currentPlayer.name}, ¡te toca beber!`);
      } else {
        toast.success(`¡Bien ${currentPlayer.name}! ¡No bebes esta vez!`);
      }

      // Pass the drawnCard to advanceTurn, so it can become the next currentCard
      // We also need to get the latest nextPlayerIndex to set the new message correctly.
      const nextPlayerIndex = (playerTurnIndex + 1) % players.length;
      setTimeout(() => advanceTurn(drawnCard, nextPlayerIndex), 3000); // Pass drawnCard here
    }, 500); // Card flip animation duration
  };

  // advanceTurn now accepts the card that was just drawn as its argument
  const advanceTurn = (prevDrawnCard: Card, nextPlayerIdx: number) => {
    // This card was 'nextCard' in the previous round, now it becomes 'currentCard'
    setCurrentCard(prevDrawnCard);
    setNextCard(null); // Clear nextCard as it's no longer the revealed card

    if (deck.length === 0) {
      setGameState("gameOver");
      setLastOutcomeMessage("¡Se acabó el mazo! Juego finalizado.");
      if (onGameEnd) {
        onGameEnd();
      }
      return;
    }

    setPlayerTurnIndex(nextPlayerIdx); // Update player index
    setGameState("waitingForBet");
    setLastOutcomeMessage(`¡Turno de ${players[nextPlayerIdx].name}!`);
  };

  // Handle Enter key press for adding players
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  // Setup phase - Player management
  if (gamePhase === "setup") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
        <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 text-center">
          🍻 Alto o Bajo 🍻
        </h1>

        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 w-full max-w-md border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
            Configurar Jugadores
          </h2>

          {/* Add player form */}
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nombre del jugador..."
              className="flex-1 px-4 py-3 bg-gray-700/80 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
              maxLength={20}
            />
            <button
              type="button"
              onClick={addPlayer}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg inline-flex items-center transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Players list */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">
              Jugadores ({players.length}):
            </h3>
            {players.length === 0 ? (
              <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                <p>No hay jugadores aún...</p>
                <p className="text-sm mt-2">Añade al menos 2 para empezar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-gray-700/60 rounded-lg p-4 border border-gray-600"
                  >
                    <span className="font-medium text-lg">
                      {index + 1}. {player.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePlayer(player.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Start game button */}
          <button
            type="button"
            onClick={startGameWithPlayers}
            disabled={players.length < 2}
            className={`w-full py-4 rounded-lg font-bold text-lg inline-flex items-center justify-center transition-all shadow-lg ${
              players.length >= 2
                ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900 hover:shadow-xl transform hover:-translate-y-1"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Play className="mr-3" size={24} />
            ¡Empezar Juego!
            {players.length < 2 &&
              ` (Necesitas ${2 - players.length} jugador${
                2 - players.length === 1 ? "" : "es"
              } más)`}
          </button>
        </div>
      </div>
    );
  }

  // Playing phase - Main game
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      {/* Add CSS for card flip animation */}
      <style>{`
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
        
        @keyframes flipIn {
          0% {
            transform: perspective(400px) rotateY(90deg);
            opacity: 0;
          }
          40% {
            transform: perspective(400px) rotateY(-10deg);
            opacity: 1;
          }
          70% {
            transform: perspective(400px) rotateY(10deg);
          }
          100% {
            transform: perspective(400px) rotateY(0deg);
            opacity: 1;
          }
        }
        
        .flip-in {
          animation: flipIn 0.6s ease-in-out;
        }
      `}</style>

      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-8 text-yellow-400 text-center">
          🍻 Alto o Bajo 🍻
        </h1>

        {gameState === "gameOver" ? (
          <div className="text-center bg-gray-800/90 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-yellow-400">
              ¡Juego Terminado!
            </h2>
            <p className="text-xl mb-8 text-gray-200">{lastOutcomeMessage}</p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                <RefreshCcw className="mr-2" size={20} /> Jugar de Nuevo
              </button>
              <button
                type="button"
                onClick={resetToSetup}
                className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                <Plus className="mr-2" size={20} /> Cambiar Jugadores
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Player Turn Indicator */}
            <div className="mb-8 text-center bg-gray-800/90 rounded-xl p-6 border border-gray-700">
              <p className="text-lg text-gray-300 mb-2">Turno de:</p>
              <p className="font-bold text-2xl text-yellow-300">
                {currentPlayer?.name}
              </p>
              <p className="text-sm text-gray-400 mt-3">
                Cartas restantes:{" "}
                <span className="font-semibold text-yellow-400">
                  {deck.length}
                </span>
              </p>
            </div>

            {/* Card Display */}
            <div className="mb-8 flex justify-center items-center gap-6">
              {/* Current Card */}
              <div className="relative w-32 h-44">
                <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl shadow-2xl flex items-center justify-center border-2 border-gray-600 overflow-hidden">
                  {currentCard !== null ? (
                    <img
                      src={currentCard.url}
                      alt={currentCard.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const container = target.parentElement;
                        if (
                          container &&
                          !container.querySelector(".fallback-text")
                        ) {
                          const fallback = document.createElement("span");
                          fallback.className =
                            "text-red-400 text-sm font-bold p-2 text-center fallback-text";
                          fallback.textContent = currentCard.name;
                          container.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <img src="/cards/reverse.png" alt="Card Back" />
                  )}
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-300">
                  Actual
                </div>
              </div>

              {/* VS indicator */}
              <div className="text-2xl font-bold text-yellow-400">VS</div>

              {/* Next Card with flip animation */}
              <div className="relative">
                <div className={`card-flip ${isFlipping ? "flipping" : ""}`}>
                  <div className="card-flip-inner">
                    {/* Card Front (shows next card when available, otherwise card back) */}
                    <div className="card-face">
                      {nextCard !== null ? (
                        <img
                          src={nextCard.url}
                          alt={nextCard.name}
                          className="card-image"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const container = target.parentElement;
                            if (
                              container &&
                              !container.querySelector(".fallback-front")
                            ) {
                              const fallback = document.createElement("span");
                              fallback.className =
                                "card-fallback fallback-front";
                              fallback.textContent = nextCard.name;
                              container.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <img
                          src="/cards/reverse.png"
                          alt="Card Back"
                          className="card-image"
                        />
                      )}
                    </div>

                    {/* Card Back (shows card back) */}
                    <div className="card-face card-back">
                      <img
                        src="/cards/reverse.png"
                        alt="Card Back"
                        className="card-image"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-300">
                  {gameState === "waitingForBet" ? "Siguiente" : "Resultado"}
                </div>
              </div>
            </div>

            {/* Result overlay */}
            {gameState === "showingResult" && (
              <div className="mb-6 bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-gray-600 text-center">
                <p className="text-xl font-semibold text-yellow-300">
                  {lastOutcomeMessage}
                </p>
              </div>
            )}

            {/* Bet Buttons */}
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

            {/* Show loading state during flip */}
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

      {/* Game Controls */}
      <div className="flex gap-4 mt-auto">
        <button
          type="button"
          onClick={startGame}
          className="bg-yellow-600 hover:bg-yellow-700 text-white inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
        >
          <RefreshCcw className="mr-2" size={18} /> Nuevo Mazo
        </button>
        <button
          type="button"
          onClick={resetToSetup}
          className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
        >
          <Plus className="mr-2" size={18} /> Cambiar Jugadores
        </button>
      </div>
    </div>
  );
};
