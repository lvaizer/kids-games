import { useNavigate } from 'react-router-dom';
import './GameCard.css';

function GameCard({ game }) {
  const navigate = useNavigate();

  return (
    <button className="game-card" onClick={() => navigate(game.path)}>
      <div className="game-card-image" style={{ background: game.gradient }}>
        <span className="game-card-emoji">{game.emoji}</span>
      </div>
      <span className="game-card-name">{game.name}</span>
    </button>
  );
}

export default GameCard;
