// Sample puzzle data for the Connections game
export const samplePuzzle = {
  id: 'valentines-2026',
  categories: [
    {
      categoryName: 'Romantic Gestures',
      description: 'Ways to show love',
      words: ['Flowers', 'Chocolate', 'Love Letter', 'Surprise Date'],
      difficulty: 'Easy'
    },
    {
      categoryName: 'Valentine\'s Colors',
      description: 'Colors associated with Valentine\'s Day',
      words: ['Red', 'Pink', 'Rose', 'Crimson'],
      difficulty: 'Easy'
    },
    {
      categoryName: 'Sweet Treats',
      description: 'Desserts and candies',
      words: ['Cupcake', 'Macaron', 'Truffle', 'Fondant'],
      difficulty: 'Medium'
    },
    {
      categoryName: 'Love Songs',
      description: 'Classic romantic songs',
      words: ['At Last', 'Can\'t Help Myself', 'Unchained Melody', 'All of Me'],
      difficulty: 'Hard'
    }
  ]
};

// Helper function to flatten categories into tiles
export function flattenPuzzle(puzzle) {
  const tiles = [];
  puzzle.categories.forEach((category, categoryIndex) => {
    category.words.forEach((word) => {
      tiles.push({
        id: `${categoryIndex}-${word}`,
        word: word,
        categoryIndex: categoryIndex,
        categoryName: category.categoryName,
        description: category.description,
        difficulty: category.difficulty
      });
    });
  });
  return tiles;
}

// Shuffle array function
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
