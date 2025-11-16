import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockBars } from '@/data/mockBars';

type Challenge = {
	id: string;
	type: 'truth' | 'dare';
	text: string;
};

const TruthDare = () => {
	const navigate = useNavigate();
	const { barId } = useParams<{ barId: string }>();
	const bar = mockBars.find((b) => b.id === barId);

	const [isAnimating, setIsAnimating] = useState(false);
	const [selectedType, setSelectedType] = useState<'truth' | 'dare' | null>(null);
	const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
	const [highlightTruth, setHighlightTruth] = useState(false);
	const [highlightDare, setHighlightDare] = useState(false);
	const [isFirstGame, setIsFirstGame] = useState(true);

	const animationAudioRef = useRef<HTMLAudioElement | null>(null);
	const resultAudioRef = useRef<HTMLAudioElement | null>(null);

	// Truth challenges
	const truthChallenges: Challenge[] = useMemo(
		() => [
			{ id: 't1', type: 'truth', text: '¿Cuál es tu mayor miedo cuando sales de fiesta?' },
			{ id: 't2', type: 'truth', text: '¿Has mentido alguna vez sobre tu edad para entrar a un bar?' },
			{ id: 't3', type: 'truth', text: '¿Cuál fue la peor borrachera de tu vida?' },
			{ id: 't4', type: 'truth', text: '¿Te has enamorado de alguien en un bar?' },
			{ id: 't5', type: 'truth', text: '¿Cuál es lo más vergonzoso que has hecho ebrio/a?' },
			{ id: 't6', type: 'truth', text: '¿Has tenido alguna vez una cita horrible?' },
			{ id: 't7', type: 'truth', text: '¿Cuál es tu bebida secreta favorita?' },
			{ id: 't8', type: 'truth', text: '¿Has llorado alguna vez en un baño de bar?' },
		],
		[]
	);

	// Dare challenges
	const dareChallenges: Challenge[] = useMemo(
		() => [
			{ id: 'd1', type: 'dare', text: 'Baila como si nadie te estuviera viendo durante 1 minuto' },
			{ id: 'd2', type: 'dare', text: 'Imita a una celebridad hasta que alguien adivine quién es' },
			{ id: 'd3', type: 'dare', text: 'Toma tu próxima bebida sin usar las manos' },
			{ id: 'd4', type: 'dare', text: 'Canta una canción romántica a la persona de tu derecha' },
			{ id: 'd5', type: 'dare', text: 'Habla con acento extranjero durante los próximos 10 minutos' },
			{ id: 'd6', type: 'dare', text: 'Haz 10 flexiones o toma 2 tragos' },
			{ id: 'd7', type: 'dare', text: 'Cuenta un chiste malo hasta que alguien se ría' },
			{ id: 'd8', type: 'dare', text: 'Intercambia una prenda de ropa con alguien por 5 minutos' },
		],
		[]
	);

	const startGame = useCallback(() => {
		if (isAnimating) return;

		setIsAnimating(true);
		setCurrentChallenge(null);
		setSelectedType(null);

		// Play animation sound
		if (animationAudioRef.current) {
			animationAudioRef.current.currentTime = 0;
			animationAudioRef.current.play().catch((error) => console.error('Error al reproducir audio:', error));
		}

		// Pre-select the final result
		const finalType: 'truth' | 'dare' = Math.random() < 0.5 ? 'truth' : 'dare';
		const challenges = finalType === 'truth' ? truthChallenges : dareChallenges;
		const finalChallenge = challenges[Math.floor(Math.random() * challenges.length)];

		// Animation: alternate highlighting for 2 seconds
		let switchCount = 0;
		const maxSwitches = 8; // 4 seconds of switching every 500ms

		const switchInterval = setInterval(() => {
			switchCount++;
			const showTruth = switchCount % 2 === 1;
			setHighlightTruth(showTruth);
			setHighlightDare(!showTruth);

			if (switchCount >= maxSwitches) {
				clearInterval(switchInterval);

				// Final selection animation
				setTimeout(() => {
					setHighlightTruth(finalType === 'truth');
					setHighlightDare(finalType === 'dare');
					setSelectedType(finalType);
					setCurrentChallenge(finalChallenge);
					setIsAnimating(false);
					setIsFirstGame(false); // Mark that first game is complete

					// Stop animation sound
					if (animationAudioRef.current) {
						animationAudioRef.current.pause();
						animationAudioRef.current.currentTime = 0;
					}

					// Play result sound
					if (resultAudioRef.current) {
						resultAudioRef.current.currentTime = 0;
						resultAudioRef.current
							.play()
							.catch((error) => console.error('Error al reproducir audio de resultado:', error));
					}
				}, 250);
			}
		}, 250);
	}, [isAnimating, truthChallenges, dareChallenges]);

	// Auto-start game after component mounts (only for first game)
	useEffect(() => {
		if (isFirstGame) {
			const startTimer = setTimeout(() => {
				startGame();
			}, 2000); // Start after 2 seconds

			return () => clearTimeout(startTimer);
		}
	}, [startGame, isFirstGame]);

	const reset = () => {
		setIsAnimating(false);
		setSelectedType(null);
		setCurrentChallenge(null);
		setHighlightTruth(false);
		setHighlightDare(false);
		// Don't reset isFirstGame - keep it false so subsequent games wait for manual start

		if (animationAudioRef.current) {
			animationAudioRef.current.pause();
			animationAudioRef.current.currentTime = 0;
		}
	};

	return (
		<div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
			{/* Hidden audio elements */}
			<audio ref={animationAudioRef} src="/sounds/circus-music.mp3" preload="auto" loop />
			<audio ref={resultAudioRef} src="/sounds/cerveza_bote.mp3" preload="auto" />

			{/* Header */}
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
			<div className="p-4">
				<div className="max-w-6xl mx-auto">
					{/* Title section */}
					<div className="text-center mb-8 pt-8">
						<h1
							className="text-6xl font-extrabold mb-4 animate-bounce"
							style={{
								color: 'white',
								textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.5)',
							}}
						>
							🎭 VERDAD O RETO 🎭
						</h1>
						{bar && (
							<h2
								className="text-3xl font-bold"
								style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
							>
								en {bar.name}
							</h2>
						)}
						<p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem', fontSize: '1.2rem' }}>
							¡Elige tu destino y acepta el desafío! 🔥
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
						<div className="flex flex-col items-center justify-center gap-12">
							{/* Choice buttons */}
							<div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
								{/* Truth Button */}
								<div
									className={`flex-1 p-8 rounded-3xl transition-all duration-300 transform ${
										isAnimating
											? 'pointer-events-none'
											: !isFirstGame && !currentChallenge
											? 'hover:scale-105 cursor-pointer'
											: ''
									} ${highlightTruth ? 'animate-pulse scale-110' : ''}`}
									style={{
										background:
											highlightTruth || selectedType === 'truth'
												? 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)'
												: 'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)',
										boxShadow: highlightTruth
											? '0 0 50px rgba(59, 130, 246, 0.8), 0 20px 40px rgba(59, 130, 246, 0.4)'
											: '0 10px 30px rgba(59, 130, 246, 0.3)',
										border: highlightTruth
											? '4px solid #ffffff'
											: '2px solid rgba(255,255,255,0.5)',
									}}
									onClick={!isAnimating && !isFirstGame && !currentChallenge ? startGame : undefined}
								>
									<div className="text-center">
										<div className="text-6xl mb-4">🤔</div>
										<h3
											className="text-4xl font-black mb-4"
											style={{
												color: 'white',
												textShadow: '0 2px 4px rgba(0,0,0,0.3)',
											}}
										>
											VERDAD
										</h3>
										<p
											style={{
												color: 'rgba(255,255,255,0.9)',
												fontSize: '1.2rem',
												fontWeight: '600',
											}}
										>
											Responde con honestidad
										</p>
									</div>
								</div>

								{/* VS Divider */}
								<div className="flex items-center justify-center">
									<div
										className="text-4xl font-black px-4 py-2 rounded-full"
										style={{
											background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
											color: '#333',
											textShadow: '0 2px 4px rgba(255,255,255,0.5)',
											boxShadow: '0 8px 16px rgba(255, 215, 0, 0.4)',
										}}
									>
										VS
									</div>
								</div>

								{/* Dare Button */}
								<div
									className={`flex-1 p-8 rounded-3xl transition-all duration-300 transform ${
										isAnimating
											? 'pointer-events-none'
											: !isFirstGame && !currentChallenge
											? 'hover:scale-105 cursor-pointer'
											: ''
									} ${highlightDare ? 'animate-pulse scale-110' : ''}`}
									style={{
										background:
											highlightDare || selectedType === 'dare'
												? 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)'
												: 'linear-gradient(135deg, #FCA5A5 0%, #F87171 100%)',
										boxShadow: highlightDare
											? '0 0 50px rgba(239, 68, 68, 0.8), 0 20px 40px rgba(239, 68, 68, 0.4)'
											: '0 10px 30px rgba(239, 68, 68, 0.3)',
										border: highlightDare ? '4px solid #ffffff' : '2px solid rgba(255,255,255,0.5)',
									}}
									onClick={!isAnimating && !isFirstGame && !currentChallenge ? startGame : undefined}
								>
									<div className="text-center">
										<div className="text-6xl mb-4">🔥</div>
										<h3
											className="text-4xl font-black mb-4"
											style={{
												color: 'white',
												textShadow: '0 2px 4px rgba(0,0,0,0.3)',
											}}
										>
											RETO
										</h3>
										<p
											style={{
												color: 'rgba(255,255,255,0.9)',
												fontSize: '1.2rem',
												fontWeight: '600',
											}}
										>
											Acepta el desafío
										</p>
									</div>
								</div>
							</div>

							{/* Instructions or Result */}
							{!currentChallenge && !isAnimating && isFirstGame && (
								<div
									className="p-6 rounded-3xl text-center max-w-2xl"
									style={{
										background: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)',
										boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
									}}
								>
									<div
										className="text-2xl font-black mb-2"
										style={{
											color: '#333',
											textShadow: '0 2px 4px rgba(255,255,255,0.5)',
										}}
									>
										🎪 ¡PREPARÁNDOSE PARA COMENZAR! 🎪
									</div>
									<p style={{ color: '#555', fontSize: '1.2rem', fontWeight: '600' }}>
										El juego comenzará automáticamente en unos segundos...
									</p>
								</div>
							)}

							{!currentChallenge && !isAnimating && !isFirstGame && (
								<div
									className="p-6 rounded-3xl text-center max-w-2xl"
									style={{
										background: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)',
										boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
									}}
								>
									<div
										className="text-2xl font-black mb-2"
										style={{
											color: '#333',
											textShadow: '0 2px 4px rgba(255,255,255,0.5)',
										}}
									>
										🎪 ¡ELIGE TU DESTINO! 🎪
									</div>
									<p style={{ color: '#555', fontSize: '1.2rem', fontWeight: '600' }}>
										Haz clic en VERDAD o RETO para comenzar la próxima ronda
									</p>
								</div>
							)}

							{isAnimating && (
								<div
									className="p-6 rounded-3xl text-center max-w-2xl"
									style={{
										background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
										boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
									}}
								>
									<div
										className="text-2xl font-black mb-2 animate-pulse"
										style={{
											color: 'white',
											textShadow: '0 2px 4px rgba(0,0,0,0.3)',
										}}
									>
										🎲 SELECCIONANDO... 🎲
									</div>
									<p
										style={{
											color: 'rgba(255,255,255,0.9)',
											fontSize: '1.2rem',
											fontWeight: '600',
										}}
									>
										El destino está decidiendo por ti...
									</p>
								</div>
							)}

							{currentChallenge && (
								<div
									className="p-8 rounded-3xl animate-bounce-in relative overflow-hidden max-w-2xl w-full"
									style={{
										background:
											selectedType === 'truth'
												? 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)'
												: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
										border: selectedType === 'truth' ? '6px solid #3B82F6' : '6px solid #EF4444',
										boxShadow:
											selectedType === 'truth'
												? '0 20px 50px rgba(59, 130, 246, 0.4), 0 0 0 4px white'
												: '0 20px 50px rgba(239, 68, 68, 0.4), 0 0 0 4px white',
									}}
								>
									{/* Confetti effect */}
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
										<div
											className="absolute top-1/2 left-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"
											style={{ animationDelay: '0.8s' }}
										/>
										<div
											className="absolute top-1/2 right-2 w-4 h-4 bg-red-400 rounded-full animate-ping"
											style={{ animationDelay: '1s' }}
										/>
									</div>

									<div className="text-center relative z-10">
										<div className="text-6xl mb-4">{selectedType === 'truth' ? '🤔' : '🔥'}</div>
										<div
											className="font-black text-3xl mb-4"
											style={{
												color: selectedType === 'truth' ? '#1E40AF' : '#DC2626',
												textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
											}}
										>
											¡{selectedType === 'truth' ? 'VERDAD' : 'RETO'}! 🎉
										</div>
										<div
											className="text-xl font-bold leading-relaxed"
											style={{
												color: '#374151',
												lineHeight: '1.6',
											}}
										>
											{currentChallenge.text}
										</div>
									</div>
								</div>
							)}

							{/* Reset button */}
							{(currentChallenge || isAnimating) && (
								<button
									onClick={reset}
									className="px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105"
									style={{
										background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
										color: 'white',
										boxShadow: '0 8px 16px rgba(75, 85, 99, 0.3)',
									}}
								>
									🔄 Jugar de Nuevo
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TruthDare;
