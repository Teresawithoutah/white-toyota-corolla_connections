import './Results.css';

function Results({ puzzle, solvedCategories, gameState }) {
  if (gameState !== 'won' && gameState !== 'lost') return null;

  return (
    <div className="results" role="region" aria-label="Game results">
      <h2 className="results-title">
        {gameState === 'won' ? '🎉 All Categories Solved!' : 'Categories Revealed'}
      </h2>
      <div className="categories-grid">
        {puzzle.categories.map((category, index) => {
          const isSolved = solvedCategories.includes(index);
          return (
            <div
              key={index}
              className={`category-card ${isSolved ? 'solved' : ''} ${gameState === 'lost' ? 'revealed' : ''}`}
            >
              <div className="category-header">
                <span className="category-number">{index + 1}</span>
                <h3 className="category-name">{category.categoryName}</h3>
                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}
                <span className="category-difficulty">{category.difficulty}</span>
              </div>
              <div className="category-words">
                {category.words.map((word, wordIndex) => (
                  <span key={wordIndex} className="category-word">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Results;
