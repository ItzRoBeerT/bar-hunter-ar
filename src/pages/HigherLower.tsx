import { useState } from 'react';
import { toast } from 'sonner'; // For notifications
import { RefreshCcw, ArrowUp, ArrowDown, Plus, Trash2, Play } from 'lucide-react'; // Added Plus, Trash2, Play icons

// --- Helper Functions for the Card Deck ---

// Represents a standard deck of 52 cards (values 1-13, no suits needed for this game)
// We'll use 1 for Ace, 11 for Jack, 12 for Queen, 13 for King.
const createDeck = () => {
  const deck = [];
  for (let i = 0; i < 4; i++) { // 4 suits
    for (let j = 1; j <= 13; j++) { // 13 ranks
      deck.push(j);
    }
  }
  return deck;
};

const shuffleDeck = (deck: number[]): number[] => {
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
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing'>('setup');

  // Game state
  const [deck, setDeck] = useState<number[]>([]);
  const [currentCard, setCurrentCard] = useState<number | null>(null);
  const [nextCard, setNextCard] = useState<number | null>(null); // This will hold the *revealed* card for a moment
  const [playerTurnIndex, setPlayerTurnIndex] = useState(0);
  const [gameState, setGameState] = useState<'initial' | 'waitingForBet' | 'showingResult' | 'gameOver'>('initial');
  const [lastOutcomeMessage, setLastOutcomeMessage] = useState<string>('');

  // Add a new player
  const addPlayer = () => {
    if (newPlayerName.trim() === '') {
      toast.error('¡El nombre no puede estar vacío!');
      return;
    }
    if (players.some(player => player.name.toLowerCase() === newPlayerName.toLowerCase())) {
      toast.error('¡Ya existe un jugador con ese nombre!');
      return;
    }
    
    const newPlayer: Player = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      name: newPlayerName.trim()
    };
    
    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    toast.success(`¡${newPlayer.name} se ha unido al juego!`);
  };

  // Remove a player
  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };

  // Start the actual game
  const startGameWithPlayers = () => {
    if (players.length < 2) {
      toast.error('¡Necesitas al menos 2 jugadores para empezar!');
      return;
    }
    setGamePhase('playing');
    startGame();
  };

  // Reset everything to setup phase
  const resetToSetup = () => {
    setGamePhase('setup');
    setGameState('initial');
    setDeck([]);
    setCurrentCard(null);
    setNextCard(null);
    setPlayerTurnIndex(0);
    setLastOutcomeMessage('');
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
      setPlayerTurnIndex(0);
      setGameState('waitingForBet');
      setLastOutcomeMessage('¡Empieza la ronda! ¿Más alta o más baja?');
      toast.info('¡Juego iniciado! ¡A la suerte y al trago!');
    } else {
      toast.error('Error al iniciar el mazo. Reintentando...');
      setGameState('initial');
    }
  };

  // Function to get card name for display
  const getCardName = (cardValue: number | null): string => {
    if (cardValue === null) return '?';
    switch (cardValue) {
      case 1: return 'As';
      case 11: return 'Jota';
      case 12: return 'Reina';
      case 13: return 'Rey';
      default: return String(cardValue);
    }
  };

  const currentPlayer = players[playerTurnIndex];

  const handleBet = (betType: 'higher' | 'lower') => {
    if (gameState !== 'waitingForBet' || deck.length === 0) return;

    const drawnCard = deck[0];
    const newDeck = deck.slice(1);
    
    if (!drawnCard) {
      toast.error('¡No quedan cartas! El juego ha terminado.');
      setGameState('gameOver');
      return;
    }

    setDeck(newDeck);
    setNextCard(drawnCard); // Show the revealed card for the current turn
    setGameState('showingResult'); // Transition to showing result immediately

    let outcome = '';
    let playerDrinks = false;
    let everyoneDrinks = false;

    if (currentCard === null) {
      outcome = 'Error en la carta actual.';
      playerDrinks = true;
    } else if (drawnCard === currentCard) {
      outcome = `¡IGUALES (${getCardName(currentCard)})! ¡TODOS BEBEN! 🥂`;
      everyoneDrinks = true;
    } else if (betType === 'higher') {
      if (drawnCard > currentCard) {
        outcome = `¡ACIERTO! (${getCardName(currentCard)} < ${getCardName(drawnCard)}) ¡No bebes!`;
      } else {
        outcome = `¡FALLO! (${getCardName(currentCard)} > ${getCardName(drawnCard)}) ¡Bebes!`;
        playerDrinks = true;
      }
    } else if (betType === 'lower') {
      if (drawnCard < currentCard) {
        outcome = `¡ACIERTO! (${getCardName(currentCard)} > ${getCardName(drawnCard)}) ¡No bebes!`;
      } else {
        outcome = `¡FALLO! (${getCardName(currentCard)} < ${getCardName(drawnCard)}) ¡Bebes!`;
        playerDrinks = true;
      }
    }

    setLastOutcomeMessage(outcome);

    if (everyoneDrinks) {
      toast.info('¡Todos a beber! ¡Por el buen rollo!');
    } else if (playerDrinks) {
      toast.warning(`${currentPlayer.name}, ¡te toca beber!`);
    } else {
      toast.success(`¡Bien ${currentPlayer.name}! ¡No bebes esta vez!`);
    }

    // Pass the drawnCard to advanceTurn, so it can become the next currentCard
    // We also need to get the latest nextPlayerIndex to set the new message correctly.
    const nextPlayerIndex = (playerTurnIndex + 1) % players.length;
    setTimeout(() => advanceTurn(drawnCard, nextPlayerIndex), 3000); // Pass drawnCard here
  };

  // advanceTurn now accepts the card that was just drawn as its argument
  const advanceTurn = (prevDrawnCard: number, nextPlayerIdx: number) => {
    // This card was 'nextCard' in the previous round, now it becomes 'currentCard'
    setCurrentCard(prevDrawnCard);
    setNextCard(null); // Clear nextCard as it's no longer the revealed card

    if (deck.length === 0) {
      setGameState('gameOver');
      setLastOutcomeMessage('¡Se acabó el mazo! Juego finalizado.');
      if (onGameEnd) {
        onGameEnd();
      }
      return;
    }
    
    setPlayerTurnIndex(nextPlayerIdx); // Update player index
    setGameState('waitingForBet');
    setLastOutcomeMessage(`¡Turno de ${players[nextPlayerIdx].name}!`);
  };

  // Handle Enter key press for adding players
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  // Setup phase - Player management
  if (gamePhase === 'setup') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
        <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 text-center">
          🍻 Alto o Bajo 🍻
        </h1>
        
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 w-full max-w-md border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Configurar Jugadores</h2>
          
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
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Jugadores ({players.length}):</h3>
            {players.length === 0 ? (
              <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                <p>No hay jugadores aún...</p>
                <p className="text-sm mt-2">Añade al menos 2 para empezar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between bg-gray-700/60 rounded-lg p-4 border border-gray-600">
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
                ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 hover:shadow-xl transform hover:-translate-y-1'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Play className="mr-3" size={24} />
            ¡Empezar Juego!
            {players.length < 2 && ` (Necesitas ${2 - players.length} jugador${2 - players.length === 1 ? '' : 'es'} más)`}
          </button>
        </div>
      </div>
    );
  }

  // Playing phase - Main game
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-8 text-yellow-400 text-center">
          🍻 Alto o Bajo 🍻
        </h1>

        {gameState === 'gameOver' ? (
          <div className="text-center bg-gray-800/90 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-yellow-400">¡Juego Terminado!</h2>
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
              <p className="text-lg text-gray-300 mb-2">
                Turno de:
              </p>
              <p className="font-bold text-2xl text-yellow-300">{currentPlayer?.name}</p>
              <p className="text-sm text-gray-400 mt-3">
                Cartas restantes: <span className="font-semibold text-yellow-400">{deck.length}</span>
              </p>
            </div>

            {/* Card Display */}
            <div className="mb-8 flex justify-center items-center gap-6">
              {/* Current Card */}
              <div className="relative w-32 h-44 bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl shadow-2xl flex items-center justify-center text-4xl font-bold border-2 border-gray-600">
                {currentCard !== null ? (
                  <span className="text-red-400">{getCardName(currentCard)}</span>
                ) : (
                  <span className="text-gray-500">?</span>
                )}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-300">
                  Actual
                </div>
              </div>

              {/* VS indicator */}
              <div className="text-2xl font-bold text-yellow-400">
                VS
              </div>

              {/* Next Card */}
              <div className="relative w-32 h-44 bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl shadow-2xl flex items-center justify-center text-4xl font-bold border-2 border-gray-600">
                {nextCard !== null ? (
                  <span className="text-blue-400">{getCardName(nextCard)}</span>
                ) : (
                  <span className="text-gray-500">?</span>
                )}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-300">
                  {gameState === 'waitingForBet' ? 'Siguiente' : 'Resultado'}
                </div>
              </div>
            </div>

            {/* Result overlay */}
            {gameState === 'showingResult' && (
              <div className="mb-6 bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-gray-600 text-center">
                <p className="text-xl font-semibold text-yellow-300">{lastOutcomeMessage}</p>
              </div>
            )}

            {/* Bet Buttons */}
            {gameState === 'waitingForBet' && (
              <div className="flex gap-4 mb-8 justify-center">
                <button
                  type="button"
                  onClick={() => handleBet('higher')}
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg transition-all inline-flex items-center font-bold hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ArrowUp className="mr-3" size={24} /> ¡Más Alta!
                </button>
                <button
                  type="button"
                  onClick={() => handleBet('lower')}
                  className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg transition-all inline-flex items-center font-bold hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ArrowDown className="mr-3" size={24} /> ¡Más Baja!
                </button>
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