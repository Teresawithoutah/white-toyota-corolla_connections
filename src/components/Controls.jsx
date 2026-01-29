import './Controls.css';

function Controls({ 
  selectedCount, 
  onSubmit, 
  onDeselectAll, 
  onShuffle,
  canSubmit,
  hasUnsolvedTiles 
}) {
  return (
    <div className="controls" role="toolbar" aria-label="Game controls">
      <button
        className="control-button submit-button"
        onClick={onSubmit}
        disabled={!canSubmit}
        aria-label="Submit selected tiles"
      >
        Submit {selectedCount > 0 && `(${selectedCount})`}
      </button>
      <button
        className="control-button deselect-button"
        onClick={onDeselectAll}
        disabled={selectedCount === 0}
        aria-label="Deselect all tiles"
      >
        Deselect All
      </button>
      <button
        className="control-button shuffle-button"
        onClick={onShuffle}
        disabled={!hasUnsolvedTiles}
        aria-label="Shuffle remaining tiles"
      >
        Shuffle
      </button>
    </div>
  );
}

export default Controls;
