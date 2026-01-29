import { useState, useEffect, useCallback } from 'react';
import { flattenPuzzle, shuffleArray } from '../data/puzzles';
import Board from './Board';
import Controls from './Controls';
import Status from './Status';
import Results from './Results';
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
  const [solvedCategories, setSolvedCategories] = useState([]);

  // Save game state to localStorage
  useEffect(() => {
    const gameState = {
      puzzleId: puzzle.id,
      tiles,
      selectedIds,
      solvedIds,
      mistakes
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [tiles, selectedIds, solvedIds, mistakes, puzzle.id]);

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

  const handleTileClick = useCallback((tileId) => {
    if (gameState !== 'playing') return;
    
    const tile = tiles.find(t => t.id === tileId);
    if (!tile || solvedIds.includes(tileId)) return;

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
  }, [tiles, solvedIds, gameState]);

  const handleTileKeyDown = useCallback((e, tileId, index) => {
    if (gameState !== 'playing') return;

    const tile = tiles.find(t => t.id === tileId);
    if (!tile || solvedIds.includes(tileId)) return;

    // Arrow key navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || 
        e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const unsolvedTiles = tiles.filter(t => !solvedIds.includes(t.id));
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
  }, [tiles, solvedIds, gameState, handleTileClick]);

  const checkOneAway = useCallback((selectedTileIds) => {
    if (selectedTileIds.length !== 4) return false;

    const selectedTiles = tiles.filter(t => selectedTileIds.includes(t.id));
    
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
  }, [tiles, puzzle]);

  const handleSubmit = useCallback(() => {
    if (selectedIds.length !== 4 || gameState !== 'playing') return;

    const selectedTiles = tiles.filter(t => selectedIds.includes(t.id));
    const categoryIndices = selectedTiles.map(t => t.categoryIndex);
    
    // Check if all 4 tiles belong to the same category
    const allSameCategory = categoryIndices.every(idx => idx === categoryIndices[0]);
    
    if (allSameCategory) {
      // Correct! Mark as solved
      setSolvedIds(prev => [...prev, ...selectedIds]);
      setSolvedCategories(prev => {
        const categoryIndex = categoryIndices[0];
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
  }, [selectedIds, tiles, gameState, checkOneAway]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds([]);
    setHint('');
  }, []);

  const handleShuffle = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const unsolvedTiles = tiles.filter(t => !solvedIds.includes(t.id));
    const shuffledUnsolved = shuffleArray(unsolvedTiles);
    const solvedTiles = tiles.filter(t => solvedIds.includes(t.id));
    
    // Recombine: keep solved tiles, shuffle unsolved
    setTiles([...solvedTiles, ...shuffledUnsolved]);
  }, [tiles, solvedIds, gameState]);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to start a new game? Your progress will be lost.')) {
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

  const unsolvedTiles = tiles.filter(t => !solvedIds.includes(t.id));
  const canSubmit = selectedIds.length === 4 && gameState === 'playing';
  const hasUnsolvedTiles = unsolvedTiles.length > 0;

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-header-top">
          <h1 className="game-title">Connections</h1>
          <button 
            className="reset-button" 
            onClick={handleReset}
            aria-label="Start new game"
          >
            New Game
          </button>
        </div>
        <p className="game-subtitle">Find groups of four that share a common theme</p>
      </div>
      
      <Status 
        mistakes={mistakes} 
        maxMistakes={MAX_MISTAKES}
        hint={hint}
        gameState={gameState}
      />
      
      {gameState === 'playing' && (
        <>
          <Board
            tiles={tiles}
            selectedIds={selectedIds}
            solvedIds={solvedIds}
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
        />
      )}
    </div>
  );
}

export default Game;
