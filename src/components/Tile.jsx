import { useEffect, useRef } from 'react';
import './Tile.css';

function Tile({ tile, isSelected, isSolved, isIncorrect, onClick, onKeyDown, tabIndex }) {
  const tileRef = useRef(null);

  useEffect(() => {
    if (isIncorrect) {
      // Trigger shake animation
      tileRef.current?.classList.add('shake');
      const timer = setTimeout(() => {
        tileRef.current?.classList.remove('shake');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isIncorrect]);

  const getStateClass = () => {
    if (isSolved) return 'solved';
    if (isSelected) return 'selected';
    if (isIncorrect) return 'incorrect';
    return 'default';
  };

  return (
    <button
      ref={tileRef}
      className={`tile ${getStateClass()}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      aria-pressed={isSelected}
      aria-label={`${tile.word}${isSelected ? ', selected' : ''}${isSolved ? ', solved' : ''}`}
      disabled={isSolved}
    >
      {tile.word}
    </button>
  );
}

export default Tile;
