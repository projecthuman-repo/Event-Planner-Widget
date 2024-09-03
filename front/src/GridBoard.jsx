import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableGridItem from './DraggableGridItem';

const GridBoard = ({ placedItems, setPlacedItems, gridSize, stageShape }) => {
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);

  const [{ isOver }, drop] = useDrop({
    accept: 'item',
    drop: (draggedItem, monitor) => {
      const dropArea = document.getElementById('drop-area');
      const offset = monitor.getClientOffset();
      const boundingRect = dropArea.getBoundingClientRect();

      const x = offset.x - boundingRect.left;
      const y = offset.y - boundingRect.top;

      setPlacedItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex((item) => item.id === draggedItem.id);
        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], x, y };
          return updatedItems;
        } else {
          return [...prevItems, { ...draggedItem, x, y, dropped: true }];
        }
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  useEffect(() => {
    const calculateBoardSize = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const headerHeight = 60;
      const margin = 40;
      const maxHeight = viewportHeight - headerHeight - margin;
      const maxWidth = viewportWidth * 0.8; // 80% of viewport width

      let width, height;
      let baseSize;

      if (stageShape === 'circle') {
        // Adjust circle sizes
        switch (gridSize) {
          case 1: // Small
            baseSize = Math.min(maxHeight, maxWidth) * 0.6;
            break;
          case 2: // Medium
            baseSize = Math.min(maxHeight, maxWidth) * 0.75;
            break;
          case 3: // Large
            baseSize = Math.min(maxHeight, maxWidth) * 0.9;
            break;
          default:
            baseSize = Math.min(maxHeight, maxWidth) * 0.6;
        }
        width = height = baseSize;
        setCols(1);
        setRows(1);
      } else if (stageShape === 'rectangle') {
        baseSize = Math.min(200, maxHeight / 6);
        switch (gridSize) {
          case 30: // 6x5
            setCols(6);
            setRows(5);
            break;
          case 35: // 7x5
            setCols(7);
            setRows(5);
            break;
          case 42: // 7x6
            setCols(7);
            setRows(6);
            break;
          default:
            setCols(6);
            setRows(5);
        }
        width = baseSize * cols;
        height = baseSize * rows;
      } else { // square
        const sideLength = Math.sqrt(gridSize);
        setCols(sideLength);
        setRows(sideLength);
        
        // Adjust baseSize calculation for squares to make them smaller
        switch (gridSize) {
          case 4: // 2x2
            baseSize = Math.min(160, Math.min(maxWidth, maxHeight) / sideLength);
            break;
          case 9: // 3x3
            baseSize = Math.min(140, Math.min(maxWidth, maxHeight) / sideLength);
            break;
          case 16: // 4x4
            baseSize = Math.min(120, Math.min(maxWidth, maxHeight) / sideLength);
            break;
          case 25: // 5x5
            baseSize = Math.min(100, Math.min(maxWidth, maxHeight) / sideLength);
            break;
          default:
            baseSize = Math.min(160, Math.min(maxWidth, maxHeight) / sideLength);
        }
        width = height = baseSize * sideLength;
      }

      // Ensure the board fits within the viewport
      if (width > maxWidth) {
        const scale = maxWidth / width;
        width = maxWidth;
        height *= scale;
      }

      if (height > maxHeight) {
        const scale = maxHeight / height;
        width *= scale;
        height = maxHeight;
      }

      setBoardSize({ width, height });
    };

    calculateBoardSize();
    window.addEventListener('resize', calculateBoardSize);
    return () => window.removeEventListener('resize', calculateBoardSize);
  }, [gridSize, stageShape, cols, rows]);

  const getStageStyle = () => {
    const baseStyle = {
      width: `${boardSize.width}px`,
      height: `${boardSize.height}px`,
      border: '2px dashed #ccc',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      margin: 'auto',
    };

    return stageShape === 'circle' 
      ? { ...baseStyle, borderRadius: '50%' }
      : baseStyle;
  };

  const getGridStyle = () => {
    if (stageShape === 'circle') {
      return { display: 'none' };
    }

    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    };
  };

  return (
    <div
      id="drop-area"
      ref={drop}
      className="drop-area"
      style={getStageStyle()}
    >
      <div style={getGridStyle()}>
        {Array.from({ length: cols * rows }).map((_, index) => (
          <div
            key={index}
            style={{
              border: '1px dashed #ccc',
              boxSizing: 'border-box',
            }}
          />
        ))}
      </div>
      {placedItems.map((item) => (
        item.dropped && (
          <DraggableGridItem
            key={item.id}
            item={item}
            style={{
              top: `${item.y}px`,
              left: `${item.x}px`,
              position: 'absolute',
            }}
            onDelete={(id) => setPlacedItems(placedItems.filter((i) => i.id !== id))}
          />
        )
      ))}
    </div>
  );
};

export default GridBoard;