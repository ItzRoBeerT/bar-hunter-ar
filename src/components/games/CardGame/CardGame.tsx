import React, { useState } from 'react';
import Card from './Card';
import './CardGame.css';

type Player = {
	id: number;
	name: string;
};

type GameCard = {
	id: number;
	value: number;
	flipped: boolean;
	playerId: number;
	imagePath: string;
};

type GameState = 'setup' | 'distributed' | 'revealed' | 'finished';

// Baraja española simulada con URLs de imágenes
const SPANISH_DECK = [
	{
		name: 'As de Oros',
		value: 1,
		url: 'https://images-ext-1.discordapp.net/external/DolmilNTQ-Rzp_Fnp4tf6MvRFPUExFguHhi4tIIQAYA/https/www.profedeele.es/wp-content/uploads/h5p/content/1873/images/image-5fbe26415a8bd.png?format=webp&quality=lossless&width=520&height=800',
	},
	{
		name: 'Tres de Bastos',
		value: 3,
		url: 'https://imgs.search.brave.com/M_AnBgLubN-hNpkZkcNRaasl5-NNzIQU8CBE494ywJY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bGFndWlhZGVsdGFy/b3QuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzEyLzMt/NC5wbmcud2Vi/cA',
	},
	{
		name: 'Tres de Copas',
		value: 3,
		url: 'https://imgs.search.brave.com/IR0EgivhKVKIzO7aWVA0Ol-ZE6vDoT9AugnwsVMNjWA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2ZjL2I1/L2JlL2ZjYjViZTNl/NGE5ODA0OWIyZTkz/ZGM4OGMwMGQyYmRj/LmpwZw',
	},
	{
		name: 'Seis de Copas',
		value: 6,
		url: 'https://imgs.search.brave.com/fL-rqBuLge1uxQlyi-D5RmQZUS5B3x38oS5IR_vJIcs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vp/UHNEVFR5QjBoUWVf/U1pxcENTakRGVTNE/cnhxOVAwbTJDZDVa/TlBUUWRHVW9naC1w/ZXV6VjlKRmI2Y3cy/TGtMdExmSEpKUWRR/czNwUXVMWGYwWTFD/SWhlQm9BUThNeXN5/UjZmbzVTTko4WGk2/UWdXcXZkSWNNWm5B/dzZEV3d2ZUxMbVdq/TGFVaWEvczQwMC8w/NmNfLmpwZw',
	},
	{
		name: 'Siete de Espadas',
		value: 7,
		url: 'https://imgs.search.brave.com/X54ac0DVpkK0nn2_tce0PLnXvT6WUOO_MVnB1ZnCD_o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzliLzMx/L2Q1LzliMzFkNWMx/MjFjMjM4NmYxMmI3/MmNhNTJjZDViNDFm/LmpwZw',
	},
	{
		name: 'Sota de Oros',
		value: 10,
		url: 'https://imgs.search.brave.com/c4MM5wdlPmEXjloQfx626LL40Pg3XBG204Q-H4DiWUE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bGFndWlhZGVsdGFy/b3QuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzEyL3Nv/dGEtMy5wbmcud2Vi/cA',
	},
	{
		name: 'Caballo de Oros',
		value: 11,
		url: 'https://imgs.search.brave.com/8ue6YIYdJT8y542TlwWkx-MwQVCIesnxuoqvmT1tFq8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bGFndWlhZGVsdGFy/b3QuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzEyL2Nh/YmFsbG8tMy5wbmcu/d2VicA',
	},
	{
		name: 'Rey de Bastos',
		value: 12,
		url: 'https://imgs.search.brave.com/Q-Qde08o0YqTLTPrOg5bchHf69YqzeLRWpzA2PysSfs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bGFndWlhZGVsdGFy/b3QuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzEyL3Jl/eS00LnBuZy53ZWJw',
	},
];

const CardGame: React.FC = () => {
	const [players, setPlayers] = useState<Player[]>([]);
	const [playerName, setPlayerName] = useState('');
	const [cards, setCards] = useState<GameCard[]>([]);
	const [gameState, setGameState] = useState<GameState>('setup');
	const [loser, setLoser] = useState<{ player: Player; drinks: number } | null>(null);

	const playFlipSound = () => {
		const audio = new Audio('/sounds/destapar_cerveza.mp3');
		audio.volume = 0.6;
		audio.play().catch((error) => console.error('Error al reproducir audio:', error));
	};

	const playLoserSound = () => {
		const audio = new Audio('/sounds/cerveza_bote.mp3');
		audio.volume = 0.7;
		audio.play().catch((error) => console.error('Error al reproducir audio:', error));
	};

	const addPlayer = () => {
		if (playerName.trim() && players.length < SPANISH_DECK.length) {
			setPlayers([...players, { id: Date.now(), name: playerName.trim() }]);
			setPlayerName('');
		}
	};

	const removePlayer = (id: number) => {
		setPlayers(players.filter((p) => p.id !== id));
	};

	const distributeCards = () => {
		if (players.length < 2) {
			alert('Se necesitan al menos 2 jugadores');
			return;
		}

		if (SPANISH_DECK.length < players.length) {
			alert(`No hay suficientes cartas. Disponibles: ${SPANISH_DECK.length}, Necesarias: ${players.length}`);
			return;
		}

		const shuffledDeck = [...SPANISH_DECK].sort(() => Math.random() - 0.5);
		const selectedCards = shuffledDeck.slice(0, players.length);

		const newCards: GameCard[] = players.map((player, index) => ({
			id: index,
			value: selectedCards[index].value,
			flipped: false,
			playerId: player.id,
			imagePath: selectedCards[index].url,
		}));

		setCards(newCards);
		setGameState('distributed');
		setLoser(null);

		// Flip cards one by one from left to right
		newCards.forEach((card, index) => {
			setTimeout(() => {
				playFlipSound(); // Reproducir sonido
				setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c)));

				// Reveal winner after the last card is flipped
				if (index === newCards.length - 1) {
					setTimeout(() => {
						revealWinner(newCards.map((c) => ({ ...c, flipped: true })));
					}, 800);
				}
			}, 1000 + index * 500);
		});
	};

	const revealWinner = (allCards: GameCard[]) => {
		const minValue = Math.min(...allCards.map((c) => c.value));
		const losingCard = allCards.find((c) => c.value === minValue);

		if (losingCard) {
			const losingPlayer = players.find((p) => p.id === losingCard.playerId);
			if (losingPlayer) {
				setLoser({ player: losingPlayer, drinks: 1 });
				setGameState('revealed');
				playLoserSound(); // Reproducir sonido cuando se revela el perdedor
			}
		}
	};

	const resetGame = () => {
		setCards([]);
		setGameState('setup');
		setLoser(null);
	};

	const playAgain = () => {
		setLoser(null);
		distributeCards();
	};

	return (
		<div className="card-game-container">
			<h1>🍺 Juego de Cartas 🍺</h1>
			<p style={{ color: 'black' }}>Gana el número más bajo</p>
			{gameState === 'setup' && (
				<div className="setup-section">
					<h2>Agregar Jugadores</h2>
					<div className="add-player-form">
						<input
							type="text"
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
							placeholder="Nombre del jugador"
							maxLength={20}
						/>
						<button onClick={addPlayer} disabled={players.length >= SPANISH_DECK.length}>
							Agregar
						</button>
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

					<p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
						Jugadores: {players.length} / {SPANISH_DECK.length} (máximo)
					</p>
				</div>
			)}

			{(gameState === 'distributed' || gameState === 'revealed') && (
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
										onClick={() => {}}
										imagePath={card.imagePath}
									/>
								</div>
							);
						})}
					</div>

					{loser && (
						<div className="result-section">
							<h2>¡{loser.player.name} debe beber!</h2>
							<p className="drinks-count">🍺 1 trago</p>
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
