import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import BarGame from './pages/BarGame';
import Ruleta from './pages/games/ruleta/Ruleta';
import CardGamePage from './pages/games/CardGame';
import { HigherLower } from './pages/HigherLower';
import Contacto from './pages/Contacto';
import DinosTuJuego from './pages/DinosTuJuego';
import TruthDare from './pages/TruthDare';
import CharlaConPaco from './pages/CharlaConPaco';

<header className="navbar">
  <div className="logo" style={{ backgroundImage: "url('hombre-sujetando-cerveza-pinta-replica.png')" }}></div>
</header>

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/game/:barId" element={<BarGame />} />
					<Route path="/games/ruleta" element={<Ruleta />} />
					<Route path="/games/card-game" element={<CardGamePage />} />
					<Route path="/games/higher-lower" element={<HigherLower />} />
					<Route path="/games/truth-dare" element={<TruthDare />} />
					<Route path="*" element={<NotFound />} />
					<Route path="/contacto" element={<Contacto />} />
					<Route path="/charla-con-paco" element={<CharlaConPaco />} />
					<Route path="/sugerir-juego" element={<DinosTuJuego />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
