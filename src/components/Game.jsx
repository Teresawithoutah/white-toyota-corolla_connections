import { useState, useEffect, useCallback } from 'react';
import { flattenPuzzle, shuffleArray } from '../data/puzzles';
import Board from './Board';
import Controls from './Controls';
import Status from './Status';
import Results from './Results';
import SolvedGroups from './SolvedGroups';
import BabyPage from './BabyPage';
import './Game.css';

const MAX_MISTAKES = 4;
const STORAGE_KEY = 'connections-game-state';

function Game({ puzzle }) {
  const [tiles, setTiles] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.puzzleId === puzzle.id) {
          return parsed.tiles;
        }
      } catch (e) {
        // Invalid saved data, start fresh
      }
    }
    return shuffleArray(flattenPuzzle(puzzle));
  });

  const [selectedIds, setSelectedIds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.puzzleId === puzzle.id) {
          return parsed.selectedIds || [];
        }
      } catch (e) {
        // Invalid saved data, start fresh
      }
    }
    return [];
  });

  const [solvedIds, setSolvedIds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.puzzleId === puzzle.id) {
          return parsed.solvedIds || [];
        }
      } catch (e) {
        // Invalid saved data, start fresh
      }
    }
    return [];
  });

  const [mistakes, setMistakes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.puzzleId === puzzle.id) {
          return parsed.mistakes || 0;
        }
      } catch (e) {
        // Invalid saved data, start fresh
      }
    }
    return 0;
  });

  const [incorrectIds, setIncorrectIds] = useState([]);
  const [hint, setHint] = useState('');
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [showBabyPage, setShowBabyPage] = useState(false);
  const [solvedCategories, setSolvedCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.puzzleId === puzzle.id) {
          return parsed.solvedCategories || [];
        }
      } catch (e) {
        // Invalid saved data, start fresh
      }
    }
    return [];
  });

  // Save game state to localStorage
  useEffect(() => {
    const gameState = {
      puzzleId: puzzle.id,
      tiles,
      selectedIds,
      solvedIds,
      mistakes,
      solvedCategories
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [tiles, selectedIds, solvedIds, mistakes, solvedCategories, puzzle.id]);

  // Check for win condition
  useEffect(() => {
    if (solvedIds.length === 16) {
      setGameState('won');
    }
  }, [solvedIds]);

  // Check for lose condition
  useEffect(() => {
    if (mistakes >= MAX_MISTAKES) {
      setGameState('lost');
    }
  }, [mistakes]);

  // Filter out solved tiles from display
  const unsolvedTiles = tiles.filter(t => !solvedIds.includes(t.id));

  const handleTileClick = useCallback((tileId) => {
    if (gameState !== 'playing') return;
    
    const tile = unsolvedTiles.find(t => t.id === tileId);
    if (!tile) return;

    setSelectedIds(prev => {
      if (prev.includes(tileId)) {
        // Deselect
        return prev.filter(id => id !== tileId);
      } else if (prev.length < 4) {
        // Select (max 4)
        return [...prev, tileId];
      }
      return prev; // Already at max
    });
    setHint(''); // Clear hint when selection changes
  }, [unsolvedTiles, gameState]);

  const handleTileKeyDown = useCallback((e, tileId, index) => {
    if (gameState !== 'playing') return;

    const tile = unsolvedTiles.find(t => t.id === tileId);
    if (!tile) return;

    // Arrow key navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || 
        e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = unsolvedTiles.findIndex(t => t.id === tileId);
      
      let nextIndex = currentIndex;
      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % unsolvedTiles.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + unsolvedTiles.length) % unsolvedTiles.length;
      } else if (e.key === 'ArrowDown') {
        nextIndex = Math.min(currentIndex + 4, unsolvedTiles.length - 1);
      } else if (e.key === 'ArrowUp') {
        nextIndex = Math.max(currentIndex - 4, 0);
      }
      
      const nextTile = unsolvedTiles[nextIndex];
      if (nextTile) {
        document.querySelector(`[aria-label*="${nextTile.word}"]`)?.focus();
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTileClick(tileId);
    }
  }, [unsolvedTiles, gameState, handleTileClick]);

  const checkOneAway = useCallback((selectedTileIds) => {
    if (selectedTileIds.length !== 4) return false;

    const selectedTiles = unsolvedTiles.filter(t => selectedTileIds.includes(t.id));
    
    // Check each category to see if 3 of 4 match
    for (const category of puzzle.categories) {
      const categoryWordIds = selectedTiles
        .filter(t => t.categoryIndex === puzzle.categories.indexOf(category))
        .map(t => t.id);
      
      if (categoryWordIds.length === 3) {
        return true;
      }
    }
    return false;
  }, [unsolvedTiles, puzzle]);

  const handleSubmit = useCallback(() => {
    if (selectedIds.length !== 4 || gameState !== 'playing') return;

    const selectedTiles = unsolvedTiles.filter(t => selectedIds.includes(t.id));
    const categoryIndices = selectedTiles.map(t => t.categoryIndex);
    
    // Check if all 4 tiles belong to the same category
    const allSameCategory = categoryIndices.every(idx => idx === categoryIndices[0]);
    
    if (allSameCategory) {
      // Correct! Mark as solved
      const categoryIndex = categoryIndices[0];
      setSolvedIds(prev => [...prev, ...selectedIds]);
      setSolvedCategories(prev => {
        // Add category to the end (newest solved at bottom)
        if (!prev.includes(categoryIndex)) {
          return [...prev, categoryIndex];
        }
        return prev;
      });
      setSelectedIds([]);
      setHint('');
    } else {
      // Check for "one away" hint
      if (checkOneAway(selectedIds)) {
        setHint('One away!');
      } else {
        setHint('');
      }
      
      // Incorrect - flash and count mistake
      setIncorrectIds([...selectedIds]);
      setTimeout(() => {
        setIncorrectIds([]);
        setSelectedIds([]);
      }, 500);
      
      setMistakes(prev => prev + 1);
    }
  }, [selectedIds, unsolvedTiles, gameState, checkOneAway]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds([]);
    setHint('');
  }, []);

  const handleShuffle = useCallback(() => {
    if (gameState !== 'playing') return;
    
    // Only shuffle unsolved tiles (solved ones are already removed from display)
    const shuffledUnsolved = shuffleArray(unsolvedTiles);
    setTiles(shuffledUnsolved);
  }, [unsolvedTiles, gameState]);

  const handleReset = useCallback(() => {
    if (window.confirm('U SURE ABOUT THAT?? U WILL LOSE UR PROGRESS!!')) {
      localStorage.removeItem(STORAGE_KEY);
      setTiles(shuffleArray(flattenPuzzle(puzzle)));
      setSelectedIds([]);
      setSolvedIds([]);
      setMistakes(0);
      setIncorrectIds([]);
      setHint('');
      setGameState('playing');
      setSolvedCategories([]);
    }
  }, [puzzle]);

  const canSubmit = selectedIds.length === 4 && gameState === 'playing';
  const hasUnsolvedTiles = unsolvedTiles.length > 0;

  if (showBabyPage) {
    return <BabyPage />;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-header-top">
          <h1 className="game-title">Babit Connections</h1>
          <button 
            className="reset-button" 
            onClick={handleReset}
            aria-label="Start new game"
          >
            New Game
          </button>
        </div>
        <p className="game-subtitle">Hint: I love you!</p>
      </div>
      
      <Status 
        mistakes={mistakes} 
        maxMistakes={MAX_MISTAKES}
        hint={hint}
        gameState={gameState}
      />
      
      {gameState === 'playing' && (
        <>
          <SolvedGroups 
            solvedCategories={solvedCategories}
            puzzle={puzzle}
          />
          
          <Board
            tiles={unsolvedTiles}
            selectedIds={selectedIds}
            solvedIds={[]}
            incorrectIds={incorrectIds}
            onTileClick={handleTileClick}
            onTileKeyDown={handleTileKeyDown}
          />
          
          <Controls
            selectedCount={selectedIds.length}
            onSubmit={handleSubmit}
            onDeselectAll={handleDeselectAll}
            onShuffle={handleShuffle}
            canSubmit={canSubmit}
            hasUnsolvedTiles={hasUnsolvedTiles}
          />
        </>
      )}
      
      {(gameState === 'won' || gameState === 'lost') && (
        <Results
          puzzle={puzzle}
          solvedCategories={solvedCategories}
          gameState={gameState}
          onBabyClick={() => setShowBabyPage(true)}
        />
      )}
    </div>
  );
}

export default Game;
