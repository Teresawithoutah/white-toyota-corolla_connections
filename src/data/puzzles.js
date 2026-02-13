// Sample puzzle data for the Connections game
export const samplePuzzle = {
  id: 'valentines-2026',
  categories: [
    {
      categoryName: 'Features I Love',
      description: 'Your sexiest parts',
      words: ['Lips', 'Eyes', 'Traps', 'Chin'],
      difficulty: 'Easy'
    },
    {
      categoryName: 'Traveled together to',
      description: 'All the states we\'ve been together',
      words: ['District of Columbia', 'New York', 'Pennsylvania', 'California'],
      difficulty: 'Medium'
    },
    {
      categoryName: 'Nicknames',
      description: 'Our petnames',
      words: ['Biscuit', 'Lemon', 'Bacon', 'Chicken'],
      difficulty: 'Medium'
    },
    {
      categoryName: 'Favorite Artists',
      description: 'Names of artists from our favorite shared tunes',
      words: ['Sundays', 'Seal', 'MGMT', 'Dido'],
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
