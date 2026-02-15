import './Results.css';

// Color palette for category cards (4 different colors)
const CATEGORY_COLORS = [
  { bg: '#ff0000', border: '#ff0000' }, // Red
  { bg: '#2196f3', border: '#2196f3' }, // Blue
  { bg: '#6200ff', border: '#6200ff' }, // Purple
  { bg: '#ffcd05', border: '#ffcd05' }, // Yellow
];

function Results({ puzzle, solvedCategories, gameState, onBabyClick }) {
  if (gameState !== 'won' && gameState !== 'lost') return null;

  return (
    <div className="results" role="region" aria-label="Game results">
      <h2 className="results-title">
        {gameState === 'won' ? '🎉 All Categories Solved!' : 'Categories Revealed'}
      </h2>
      <div className="categories-grid">
        {puzzle.categories.map((category, index) => {
          const isSolved = solvedCategories.includes(index);
          const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
          return (
            <div
              key={index}
              className={`category-card ${isSolved ? 'solved' : ''} ${gameState === 'lost' ? 'revealed' : ''}`}
              style={{
                backgroundColor: color.bg,
                borderColor: color.border,
              }}
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
      <button
        type="button"
        className="results-baby-button"
        onClick={onBabyClick}
      >
        if your my baby, click here
      </button>
    </div>
  );
}

export default Results;
