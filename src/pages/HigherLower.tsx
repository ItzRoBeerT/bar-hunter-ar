import React, { useState, useCallback } from 'react';
import { RefreshCcw, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

type GameState = 'waitingForBet' | 'showingResult' | 'gameOver';
type BetType = 'higher' | 'lower';

// ============================================================================
// CONSTANTS
// ============================================================================

const SPANISH_DECK: Card[] = [
	{
		name: 'As de Oros',
		value: 1,
		url: 'https://images-ext-1.discordapp.net/external/DolmilNTQ-Rzp_Fnp4tf6MvRFPUExFguHhi4tIIQAYA/https/www.profedeele.es/wp-content/uploads/h5p/content/1873/images/image-5fbe26415a8bd.png?format=webp&quality=lossless&width=520&height=800',
	},
	{
		name: 'Tres de Copas',
		value: 3,
		url: 'https://imgs.search.brave.com/IR0EgivhKVKIzO7aWVA0Ol-ZE6vDoT9AugnwsVMNjWA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2ZjL2I1/L2JlL2ZjYjViZTNl/NGE5ODA0OWIyZTkz/ZGM4OGMwMGQyYmRj/LmpwZw',
	},
	{
		name: 'Seis de Copas',
		value: 6,
		url: 'https://imgs.search.brave.com/fL-rqBuLge1uxQlyi-D5RmQZUS5B3x38oS5IR_vJIcs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vp/UHJEVFR5QjBoUWVf/U1pxcENTakRGVTNE/cnhxOVAwbTJDZDVa/TlBUUWRHVW9naC1w/ZXV6VjlKRmI2Y3cy/TGtMdExmSEpKUWRR/czNwUXVMWGYwWTFD/SWhlQm9BUThNeXN5/UjZmbzVTTko4WGk2/UWdXcXZkSWNNWm5B/dzZEV3d2ZUxMbVdq/TGFVaWEvczQwMC8w/NmNfLmpwZw',
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

const FLIP_ANIMATION_DURATION = 500;
const RESULT_DISPLAY_DURATION = 3000;

const SOUND_PATHS = {
	flip: '/sounds/flipcard.mp3',
	drink: '/sounds/cerveza_bote.mp3',
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
		warning: 'bg-yellow-600',
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
	audio.play().catch((error) => console.error('Error al reproducir audio:', error));
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const CardImage: React.FC<{ card: Card | null; isBackVisible?: boolean }> = ({ card, isBackVisible = false }) => {
	if (!card || isBackVisible) {
		return <img src="/cards/reverse.png" alt="Card Back" className="card-image" />;
	}

	return (
		<img
			src={card.url}
			alt={card.name}
			className="card-image"
			onError={(e) => {
				const target = e.currentTarget;
				target.style.display = 'none';
				const container = target.parentElement;
				if (container && !container.querySelector('.fallback-text')) {
					const fallback = document.createElement('span');
					fallback.className = 'card-fallback fallback-text';
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
	const navigate = useNavigate();

	// Game state
	const [deck, setDeck] = useState<Card[]>(remainingCards);
	const [currentCard, setCurrentCard] = useState<Card>(firstCard);
	const [nextCard, setNextCard] = useState<Card | null>(null);
	const [isFlipping, setIsFlipping] = useState(false);
	const [gameState, setGameState] = useState<GameState>('waitingForBet');
	const [lastOutcomeMessage, setLastOutcomeMessage] = useState('¿Más alta o más baja?');

	// ============================================================================
	// GAME CONTROL
	// ============================================================================

	const startNewGame = useCallback(() => {
		const shuffledDeck = createShuffledDeck();
		const [firstCard, ...remainingDeck] = shuffledDeck;

		if (!firstCard) {
			showToast('Error al iniciar el mazo. Reintentando...', 'error');
			return;
		}

		setDeck(remainingDeck);
		setCurrentCard(firstCard);
		setNextCard(null);
		setIsFlipping(false);
		setGameState('waitingForBet');
		setLastOutcomeMessage('¿Más alta o más baja?');

		showToast('¡Juego iniciado! ¡A la suerte y al trago!', 'info');
	}, []);

	// ============================================================================
	// GAME LOGIC
	// ============================================================================

	const evaluateBet = useCallback(
		(
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

			const isCorrect =
				betType === 'higher' ? drawnCardValue > currentCardValue : drawnCardValue < currentCardValue;

			const outcome = isCorrect ? `¡ACIERTO! ¡No bebes!` : `¡FALLO! ¡Bebes!`;

			return {
				outcome,
				playerDrinks: !isCorrect,
				everyoneDrinks: false,
			};
		},
		[]
	);

	const advanceTurn = useCallback(
		(prevDrawnCard: Card) => {
			setCurrentCard(prevDrawnCard);
			setNextCard(null);

			if (deck.length === 0) {
				setGameState('gameOver');
				setLastOutcomeMessage('¡Se acabó el mazo! Juego finalizado.');
				onGameEnd?.();
				return;
			}

			setGameState('waitingForBet');
			setLastOutcomeMessage('¿Más alta o más baja?');
		},
		[deck.length, onGameEnd]
	);

	const handleBet = useCallback(
		(betType: BetType) => {
			if (gameState !== 'waitingForBet' || deck.length === 0 || isFlipping) {
				return;
			}

			const [drawnCard, ...newDeck] = deck;

			if (!drawnCard) {
				showToast('¡No quedan cartas! El juego ha terminado.', 'error');
				setGameState('gameOver');
				return;
			}

			setDeck(newDeck);
			setIsFlipping(true);
			playSound(SOUND_PATHS.flip);

			setTimeout(() => {
				setNextCard(drawnCard);
				setIsFlipping(false);
				setGameState('showingResult');

				const { outcome, playerDrinks, everyoneDrinks } = evaluateBet(
					betType,
					currentCard.value,
					drawnCard.value
				);

				setLastOutcomeMessage(outcome);

				if (everyoneDrinks) {
					playSound(SOUND_PATHS.drink, 0.7);
					showToast('¡Todos a beber! ¡Por el buen rollo!', 'info');
				} else if (playerDrinks) {
					playSound(SOUND_PATHS.drink, 0.7);
					showToast('¡Te toca beber!', 'warning');
				} else {
					showToast('¡Bien! ¡No bebes esta vez!', 'success');
				}

				setTimeout(() => advanceTurn(drawnCard), RESULT_DISPLAY_DURATION);
			}, FLIP_ANIMATION_DURATION);
		},
		[gameState, deck, isFlipping, currentCard, evaluateBet, advanceTurn]
	);

	// ============================================================================
	// RENDER
	// ============================================================================

	return (
		<div>
			<header
				style={{
					background: '#d73719',
					borderBottom: '1px solid #b02b13',
					padding: '12px 16px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '12px',
					boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
					position: 'relative',
					height: '60px',
				}}
        className='pb-20'
			>
				<button
					onClick={() => navigate(-1)}
					style={{
						background: 'transparent',
						border: 'none',
						padding: '8px',
						borderRadius: '8px',
						cursor: 'pointer',
						color: 'white',
						position: 'absolute',
						left: '16px',
					}}
				>
					<ArrowLeft style={{ width: '24px', height: '24px', color: 'white' }} />
				</button>
			</header>

			<div
				className="min-h-screen p-4"
				style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
			>
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
          color: #d73719;
          font-size: 0.875rem;
          font-weight: bold;
          padding: 8px;
          text-align: center;
          word-break: break-word;
          line-height: 1.2;
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          border: 2px solid #d73719;
          border-radius: 12px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

				<div className="max-w-6xl mx-auto">
					{/* Title section */}
					<div className="text-center mb-8">
						<h1
							className="text-6xl font-extrabold pt-2 mb-4 animate-bounce"
							style={{
								color: 'white',
								textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.5)',
							}}
						>
							🍻 Alto o Bajo 🍻
						</h1>
						<p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem', fontSize: '1.2rem' }}>
							¡Adivina si la siguiente carta es más alta o más baja! 🃏
						</p>
					</div>

					{/* Main game area */}
					<div
						className="rounded-3xl shadow-2xl p-8"
						style={{
							background: 'white',
							boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 8px rgba(255,255,255,0.3)',
							border: '4px solid rgba(255,255,255,0.5)',
						}}
					>
						<div className="flex flex-col items-center justify-center gap-8">
							{gameState === 'gameOver' ? (
								<div
									className="text-center p-8 rounded-3xl"
									style={{
										background: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)',
										border: '6px solid #d73719',
										boxShadow: '0 20px 50px rgba(215, 55, 25, 0.4), 0 0 0 4px white',
									}}
								>
									<div className="absolute inset-0 opacity-20">
										<div className="absolute top-2 left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
										<div
											className="absolute top-2 right-2 w-4 h-4 bg-pink-400 rounded-full animate-ping"
											style={{ animationDelay: '0.2s' }}
										/>
										<div
											className="absolute bottom-2 left-2 w-4 h-4 bg-green-400 rounded-full animate-ping"
											style={{ animationDelay: '0.4s' }}
										/>
										<div
											className="absolute bottom-2 right-2 w-4 h-4 bg-purple-400 rounded-full animate-ping"
											style={{ animationDelay: '0.6s' }}
										/>
									</div>

									<div className="relative z-10">
										<h2
											className="font-black text-4xl mb-4"
											style={{
												color: '#d73719',
												textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
											}}
										>
											¡JUEGO TERMINADO! 🎉
										</h2>
										<p className="text-xl font-bold mb-6" style={{ color: '#333' }}>
											{lastOutcomeMessage}
										</p>
										<button
											type="button"
											onClick={startNewGame}
											style={{
												background: 'linear-gradient(135deg, #d73719 0%, #b02b13 100%)',
												color: 'white',
												padding: '16px 32px',
												borderRadius: '16px',
												fontSize: '18px',
												fontWeight: 'bold',
												border: 'none',
												cursor: 'pointer',
												boxShadow: '0 8px 16px rgba(215, 55, 25, 0.4)',
												display: 'inline-flex',
												alignItems: 'center',
												gap: '8px',
												transition: 'all 0.3s ease',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = 'scale(1.05)';
												e.currentTarget.style.boxShadow = '0 12px 24px rgba(215, 55, 25, 0.5)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = 'scale(1)';
												e.currentTarget.style.boxShadow = '0 8px 16px rgba(215, 55, 25, 0.4)';
											}}
										>
											<RefreshCcw size={20} /> Jugar de Nuevo
										</button>
									</div>
								</div>
							) : (
								<>
									<p
										style={{
											color: '#666',
											fontSize: '1.2rem',
											textAlign: 'center',
											marginBottom: '20px',
										}}
									>
										Elige si la siguiente carta es más alta o más baja que la actual
									</p>

									<div
										className="text-center p-6 rounded-2xl mb-8"
										style={{
											background: 'linear-gradient(135deg, #B5290E 0%, #8a1f08 100%)',
											border: '3px solid #d73719',
										}}
									>
										<p className="text-white mb-2 text-lg font-semibold">Cartas restantes:</p>
										<p className="font-bold text-3xl" style={{ color: '#FFD700' }}>
											{deck.length}
										</p>
									</div>

									<div className="mb-8 mx-4 flex justify-center items-center gap-4">
										<div className="relative w-32 h-44">
											<div
												className="w-full h-full rounded-xl shadow-2xl flex items-center justify-center border-4 overflow-hidden"
												style={{
													background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
													borderColor: '#d73719',
												}}
											>
												<CardImage card={currentCard} />
											</div>
											<div
												className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
												style={{ background: '#d73719' }}
											>
												Actual
											</div>
										</div>

										<div
											className="text-4xl font-black px-4 py-2 rounded-full"
											style={{
												color: '#d73719',
												textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
											}}
										>
											VS
										</div>

										<div className="relative">
											<div className={`card-flip ${isFlipping ? 'flipping' : ''}`}>
												<div className="card-flip-inner">
													<div className="card-face">
														<div
															className="w-full h-full rounded-xl shadow-2xl flex items-center justify-center border-4 overflow-hidden"
															style={{
																background:
																	'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
																borderColor: '#d73719',
															}}
														>
															<CardImage card={nextCard} />
														</div>
													</div>
													<div className="card-face card-back">
														<div
															className="w-full h-full rounded-xl shadow-2xl flex items-center justify-center border-4 overflow-hidden"
															style={{
																background:
																	'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
																borderColor: '#d73719',
															}}
														>
															<CardImage card={null} isBackVisible />
														</div>
													</div>
												</div>
											</div>
											<div
												className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
												style={{ background: '#d73719' }}
											>
												{gameState === 'waitingForBet' ? 'Siguiente' : 'Resultado'}
											</div>
										</div>
									</div>

									{gameState === 'showingResult' && (
										<div
											className="mb-6 p-6 rounded-xl text-center"
											style={{
												background: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)',
												border: '3px solid #d73719',
											}}
										>
											<p
												className="text-xl font-bold"
												style={{
													color: '#333',
													textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
												}}
											>
												{lastOutcomeMessage}
											</p>
										</div>
									)}

									{gameState === 'waitingForBet' && !isFlipping && (
										<div className="flex gap-6 mb-8 justify-center flex-wrap">
											<button
												type="button"
												onClick={() => handleBet('higher')}
												style={{
													background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
													color: 'white',
													fontSize: '18px',
													padding: '16px 32px',
													borderRadius: '16px',
													fontWeight: 'bold',
													border: 'none',
													cursor: 'pointer',
													boxShadow: '0 8px 16px rgba(16, 185, 129, 0.4)',
													display: 'inline-flex',
													alignItems: 'center',
													gap: '12px',
													transition: 'all 0.3s ease',
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
													e.currentTarget.style.boxShadow =
														'0 12px 24px rgba(16, 185, 129, 0.5)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = 'scale(1) translateY(0)';
													e.currentTarget.style.boxShadow =
														'0 8px 16px rgba(16, 185, 129, 0.4)';
												}}
											>
												<ArrowUp size={24} /> ¡Más Alta!
											</button>
											<button
												type="button"
												onClick={() => handleBet('lower')}
												style={{
													background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
													color: 'white',
													fontSize: '18px',
													padding: '16px 32px',
													borderRadius: '16px',
													fontWeight: 'bold',
													border: 'none',
													cursor: 'pointer',
													boxShadow: '0 8px 16px rgba(239, 68, 68, 0.4)',
													display: 'inline-flex',
													alignItems: 'center',
													gap: '12px',
													transition: 'all 0.3s ease',
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
													e.currentTarget.style.boxShadow =
														'0 12px 24px rgba(239, 68, 68, 0.5)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = 'scale(1) translateY(0)';
													e.currentTarget.style.boxShadow =
														'0 8px 16px rgba(239, 68, 68, 0.4)';
												}}
											>
												<ArrowDown size={24} /> ¡Más Baja!
											</button>
										</div>
									)}

									{isFlipping && (
										<div className="mb-8 text-center">
											<p className="text-xl animate-pulse font-bold" style={{ color: '#d73719' }}>
												Revelando carta...
											</p>
										</div>
									)}
								</>
							)}

							{/* Bottom button */}
							<div className="mt-8">
								<button
									type="button"
									onClick={startNewGame}
									style={{
										background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
										color: 'white',
										padding: '12px 24px',
										borderRadius: '12px',
										fontSize: '16px',
										fontWeight: 'bold',
										border: 'none',
										cursor: 'pointer',
										boxShadow: '0 6px 12px rgba(255, 165, 0, 0.4)',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '8px',
										transition: 'all 0.3s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'scale(1.05)';
										e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 165, 0, 0.5)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'scale(1)';
										e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 165, 0, 0.4)';
									}}
								>
									<RefreshCcw size={18} /> Nuevo Mazo
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
