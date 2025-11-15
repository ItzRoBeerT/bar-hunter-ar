import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Send } from 'lucide-react';
import { toast } from 'sonner';

const DinosTuJuego = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		nombre: '',
		email: '',
		nombreJuego: '',
		descripcion: '',
		reglas: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		setTimeout(() => {
			toast.success('¡Juego enviado! Lo revisaremos pronto.');
			setFormData({ nombre: '', email: '', nombreJuego: '', descripcion: '', reglas: '' });
			setIsSubmitting(false);
		}, 1000);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div style={{ minHeight: '100vh', background: '#1e293b' }}>
			{/* Header */}
			<header
				style={{
					background: '#d73719',
					borderBottom: '1px solid #b02b13',
					boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
				}}
			>
				<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
					<button
						onClick={() => navigate(-1)}
						style={{
							position: 'absolute',
							left: '16px',
							background: 'transparent',
							border: 'none',
							padding: '8px',
							borderRadius: '8px',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<ArrowLeft style={{ width: '24px', height: '24px', color: '#ffffff' }} />
					</button>
					<h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
						Dinos tu juego
					</h1>
				</div>
			</header>

			{/* Main Content */}
			<div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
				{/* Formulario */}
				<div
					style={{
						background: '#2d3748',
						borderRadius: '16px',
						padding: '32px',
						marginBottom: '24px',
						boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
					}}
				>
					<h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>
						¿Tienes un juego divertido?
					</h2>
					<p style={{ color: '#94a3b8', marginBottom: '24px' }}>
						Comparte tu juego favorito y lo añadiremos a la app.
					</p>

					<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
						<div>
							<label
								htmlFor="nombre"
								style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}
							>
								Tu nombre
							</label>
							<input
								type="text"
								id="nombre"
								name="nombre"
								value={formData.nombre}
								onChange={handleChange}
								required
								style={{
									width: '100%',
									padding: '12px 16px',
									background: '#1e293b',
									border: '2px solid #334155',
									borderRadius: '8px',
									fontSize: '16px',
									color: '#ffffff',
									outline: 'none',
								}}
								placeholder="Tu nombre"
								onFocus={(e) => (e.target.style.borderColor = '#d73719')}
								onBlur={(e) => (e.target.style.borderColor = '#334155')}
							/>
						</div>

						<div>
							<label
								htmlFor="email"
								style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								style={{
									width: '100%',
									padding: '12px 16px',
									background: '#1e293b',
									border: '2px solid #334155',
									borderRadius: '8px',
									fontSize: '16px',
									color: '#ffffff',
									outline: 'none',
								}}
								placeholder="tu@email.com"
								onFocus={(e) => (e.target.style.borderColor = '#d73719')}
								onBlur={(e) => (e.target.style.borderColor = '#334155')}
							/>
						</div>

						<div>
							<label
								htmlFor="nombreJuego"
								style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}
							>
								Nombre del juego
							</label>
							<input
								type="text"
								id="nombreJuego"
								name="nombreJuego"
								value={formData.nombreJuego}
								onChange={handleChange}
								required
								style={{
									width: '100%',
									padding: '12px 16px',
									background: '#1e293b',
									border: '2px solid #334155',
									borderRadius: '8px',
									fontSize: '16px',
									color: '#ffffff',
									outline: 'none',
								}}
								placeholder="Ej: Ruleta de tragos"
								onFocus={(e) => (e.target.style.borderColor = '#d73719')}
								onBlur={(e) => (e.target.style.borderColor = '#334155')}
							/>
						</div>

						<div>
							<label
								htmlFor="descripcion"
								style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}
							>
								Descripción breve
							</label>
							<textarea
								id="descripcion"
								name="descripcion"
								value={formData.descripcion}
								onChange={handleChange}
								required
								rows={3}
								style={{
									width: '100%',
									padding: '12px 16px',
									background: '#1e293b',
									border: '2px solid #334155',
									borderRadius: '8px',
									fontSize: '16px',
									color: '#ffffff',
									outline: 'none',
									resize: 'none',
									fontFamily: 'inherit',
								}}
								placeholder="¿De qué trata el juego?"
								onFocus={(e) => (e.target.style.borderColor = '#d73719')}
								onBlur={(e) => (e.target.style.borderColor = '#334155')}
							/>
						</div>

						<div>
							<label
								htmlFor="reglas"
								style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}
							>
								Reglas del juego
							</label>
							<textarea
								id="reglas"
								name="reglas"
								value={formData.reglas}
								onChange={handleChange}
								required
								rows={6}
								style={{
									width: '100%',
									padding: '12px 16px',
									background: '#1e293b',
									border: '2px solid #334155',
									borderRadius: '8px',
									fontSize: '16px',
									color: '#ffffff',
									outline: 'none',
									resize: 'none',
									fontFamily: 'inherit',
								}}
								placeholder="Explica cómo se juega paso a paso..."
								onFocus={(e) => (e.target.style.borderColor = '#d73719')}
								onBlur={(e) => (e.target.style.borderColor = '#334155')}
							/>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							style={{
								width: '100%',
								padding: '14px 24px',
								borderRadius: '8px',
								fontWeight: 'bold',
								fontSize: '16px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '8px',
								border: 'none',
								cursor: isSubmitting ? 'not-allowed' : 'pointer',
								background: isSubmitting ? '#6b7280' : 'linear-gradient(135deg, #d73719 0%, #b02b13 100%)',
								color: '#ffffff',
								boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
								opacity: isSubmitting ? 0.6 : 1,
								transition: 'all 0.3s',
							}}
						>
							{isSubmitting ? (
								<>
									<div
										style={{
											width: '20px',
											height: '20px',
											border: '2px solid #ffffff',
											borderTopColor: 'transparent',
											borderRadius: '50%',
											animation: 'spin 1s linear infinite',
										}}
									/>
									Enviando...
								</>
							) : (
								<>
									<Send style={{ width: '20px', height: '20px' }} />
									Enviar juego
								</>
							)}
						</button>
					</form>
				</div>

				{/* Email directo */}
				<div
					style={{
						background: '#2d3748',
						borderRadius: '16px',
						padding: '24px',
						textAlign: 'center',
						boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
					}}
				>
					<Gamepad2 style={{ width: '32px', height: '32px', color: '#d73719', margin: '0 auto 12px' }} />
					<p style={{ color: '#94a3b8', margin: 0 }}>
						¿Tienes dudas? Escríbenos a{' '}
						<a href="mailto:juegos@alcanzalavictoria.com" style={{ fontWeight: '600', color: '#d73719', textDecoration: 'none' }}>
							juegos@alcanzalavictoria.com
						</a>
					</p>
				</div>
			</div>

			{/* Animación spin */}
			<style>{`
				@keyframes spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
};

export default DinosTuJuego;
