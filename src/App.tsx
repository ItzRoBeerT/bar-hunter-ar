import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import BarGame from './pages/BarGame';
import Ruleta from './pages/Ruleta';
import CardGamePage from './pages/games/CardGame';
import { HigherLower } from './pages/HigherLower';

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
					<Route path="/ruleta/:barId" element={<Ruleta />} />
					<Route path="/games/card-game" element={<CardGamePage />} />
          <Route path="/games/higher-lower" element={<HigherLower />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
