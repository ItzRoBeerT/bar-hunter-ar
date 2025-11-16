import CardGame from '@/components/games/CardGame/CardGame';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CardGamePage = () => {
	const navigate = useNavigate();

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
			<CardGame />
		</div>
	);
};

export default CardGamePage;
