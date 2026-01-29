import './SolvedGroups.css';

function SolvedGroups({ solvedCategories, puzzle }) {
  if (solvedCategories.length === 0) return null;

  return (
    <div className="solved-groups" role="region" aria-label="Solved groups">
      <h2 className="solved-groups-title">Solved Groups</h2>
      <div className="solved-groups-list">
        {solvedCategories.map((categoryIndex, displayIndex) => {
          const category = puzzle.categories[categoryIndex];
          const categoryTiles = puzzle.categories[categoryIndex].words;
          
          return (
            <div
              key={categoryIndex}
              className="solved-group-card"
              aria-label={`Solved category: ${category.categoryName}`}
            >
              <div className="solved-group-header">
                <h3 className="solved-group-name">{category.categoryName}</h3>
                {category.description && (
                  <p className="solved-group-description">{category.description}</p>
                )}
              </div>
              <div className="solved-group-words">
                {categoryTiles.map((word, wordIndex) => (
                  <span key={wordIndex} className="solved-group-word">
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

export default SolvedGroups;
