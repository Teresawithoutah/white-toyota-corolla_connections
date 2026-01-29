import './Status.css';

function Status({ mistakes, maxMistakes, hint, gameState }) {
  const remainingMistakes = maxMistakes - mistakes;
  const mistakesArray = Array.from({ length: maxMistakes }, (_, i) => i < mistakes);

  return (
    <div className="status" role="status" aria-live="polite">
      <div className="mistakes-counter">
        <span className="mistakes-label">Mistakes remaining:</span>
        <div className="mistakes-dots" aria-label={`${remainingMistakes} mistakes remaining`}>
          {mistakesArray.map((isUsed, index) => (
            <span
              key={index}
              className={`mistake-dot ${isUsed ? 'used' : ''}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="mistakes-text">{remainingMistakes} / {maxMistakes}</span>
      </div>
      {hint && (
        <div className="hint-message" role="alert">
          {hint}
        </div>
      )}
      {gameState === 'won' && (
        <div className="game-message won" role="alert">
          🎉 Congratulations! You solved all the connections!
        </div>
      )}
      {gameState === 'lost' && (
        <div className="game-message lost" role="alert">
          Game Over! You've reached the maximum number of mistakes.
        </div>
      )}
    </div>
  );
}

export default Status;
