import React, { useState } from 'react';
import './Card.css';

type CardProps = {
	id: number;
	value: number;
	flipped: boolean;
	onClick: (id: number) => void;
	imagePath: string;
};

const Card: React.FC<CardProps> = ({ id, value, flipped, onClick, imagePath }) => {
	const [imageError, setImageError] = useState(false);

	return (
		<div className={`game-card ${flipped ? 'flipped' : ''}`} onClick={() => !flipped && onClick(id)}>
			<div className="card-inner">
				<div className="card-front">
					{imageError ? (
						<span className="card-value-fallback">{value}</span>
					) : (
						<img
							src={imagePath}
							alt={`Card ${value}`}
							className="card-image"
							onError={() => setImageError(true)}
						/>
					)}
				</div>
				<div className="card-back">
					<img
						src="/cards/reverse.png"
						alt="Card back"
						className="card-image"
						onError={(e) => {
							e.currentTarget.style.display = 'none';
							e.currentTarget.parentElement!.innerHTML = '<span class="card-back-design">🂠</span>';
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Card;
