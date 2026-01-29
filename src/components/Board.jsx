import Tile from './Tile';
import './Board.css';

function Board({ tiles, selectedIds, solvedIds, incorrectIds, onTileClick, onTileKeyDown }) {
  return (
    <div className="board" role="grid" aria-label="Word puzzle board">
      <div className="board-grid">
        {tiles.map((tile, index) => {
          const isSelected = selectedIds.includes(tile.id);
          const isSolved = solvedIds.includes(tile.id);
          const isIncorrect = incorrectIds.includes(tile.id);
          
          return (
            <Tile
              key={tile.id}
              tile={tile}
              isSelected={isSelected}
              isSolved={isSolved}
              isIncorrect={isIncorrect}
              onClick={() => onTileClick(tile.id)}
              onKeyDown={(e) => onTileKeyDown(e, tile.id, index)}
              tabIndex={isSolved ? -1 : 0}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Board;
