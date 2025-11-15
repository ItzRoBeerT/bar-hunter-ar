import React, { useState } from "react";
import Card from "./Card";
import "./CardGame.css";

type Player = {
  id: number;
  name: string;
};

type GameCard = {
  id: number;
  value: number;
  flipped: boolean;
  playerId: number;
};

type GameState = "setup" | "distributed" | "revealed" | "finished";

const CardGame: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [cards, setCards] = useState<GameCard[]>([]);
  const [gameState, setGameState] = useState<GameState>("setup");
  const [loser, setLoser] = useState<{ player: Player; drinks: number } | null>(null);

  const addPlayer = () => {
    if (playerName.trim() && players.length < 8) {
      setPlayers([...players, { id: Date.now(), name: playerName.trim() }]);
      setPlayerName("");
    }
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const distributeCards = () => {
    if (players.length < 2) {
      alert("Se necesitan al menos 2 jugadores");
      return;
    }

    const newCards: GameCard[] = players.map((player, index) => ({
      id: index,
      value: Math.floor(Math.random() * 13) + 1,
      flipped: false,
      playerId: player.id,
    }));

    setCards(newCards);
    setGameState("distributed");
    setLoser(null);
  };

  const flipCard = (cardId: number) => {
    if (gameState !== "distributed") return;

    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, flipped: true } : card
      )
    );

    // Verificar si todas las cartas están volteadas
    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, flipped: true } : card
    );
    
    if (updatedCards.every((card) => card.flipped)) {
      revealWinner(updatedCards);
    }
  };

  const revealWinner = (allCards: GameCard[]) => {
    const minValue = Math.min(...allCards.map((c) => c.value));
    const losingCard = allCards.find((c) => c.value === minValue);
    
    if (losingCard) {
      const losingPlayer = players.find((p) => p.id === losingCard.playerId);
      if (losingPlayer) {
        setLoser({ player: losingPlayer, drinks: minValue });
        setGameState("revealed");
      }
    }
  };

  const resetGame = () => {
    setCards([]);
    setGameState("setup");
    setLoser(null);
  };

  const playAgain = () => {
    distributeCards();
  };

  return (
    <div className="card-game-container"style={{ color: '#D73719' }}>
      <h1>🍺 Juego de Cartas - Bebidas 🍺</h1>

      {gameState === "setup" && (
        <div className="setup-section">
          <h2>Agregar Jugadores</h2>
          <div className="add-player-form">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addPlayer()}
              placeholder="Nombre del jugador"
              maxLength={20}
            />
            <button onClick={addPlayer}>Agregar</button>
          </div>

          <div className="players-list">
            {players.map((player) => (
              <div key={player.id} className="player-item">
                <span>{player.name}</span>
                <button onClick={() => removePlayer(player.id)}>✕</button>
              </div>
            ))}
          </div>

          {players.length >= 2 && (
            <button className="start-button" onClick={distributeCards}>
              Repartir Cartas
            </button>
          )}
        </div>
      )}

      {(gameState === "distributed" || gameState === "revealed") && (
        <div className="game-section">
          <div className="cards-grid">
            {cards.map((card) => {
              const player = players.find((p) => p.id === card.playerId);
              return (
                <div key={card.id} className="card-wrapper">
                  <p className="player-name">{player?.name}</p>
                  <Card
                    id={card.id}
                    value={card.value}
                    flipped={card.flipped}
                    onClick={flipCard}
                  />
                </div>
              );
            })}
          </div>

          {loser && (
            <div className="result-section">
              <h2>¡{loser.player.name} debe beber!</h2>
              <p className="drinks-count">🍺 {loser.drinks} {loser.drinks === 1 ? "trago" : "tragos"}</p>
              <div className="action-buttons">
                <button onClick={playAgain}>Jugar de Nuevo</button>
                <button onClick={resetGame}>Cambiar Jugadores</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardGame;
