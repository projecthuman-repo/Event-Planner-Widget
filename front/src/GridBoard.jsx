import React, { useState, useCallback, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import DraggableGridItem from './DraggableGridItem';
import SizeBar from './SizeBar';
import html2canvas from 'html2canvas';

const GridBoard = ({
  placedItems,
  onDrop,
  selectedItemId,
  setSelectedItemId,
  itemSize = { width: 50, height: 50 }, // Default item size
  setItemSize,
  handleApplySize,
  deleteItem,
}) => {
  const captureGrid = () => {
    const gridElement = document.getElementById('drop-area');

    html2canvas(gridElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'grid.png';
      link.click();
    });
  };
  const [{ isOver }, drop] = useDrop({
    accept: 'item',
    drop: useCallback(
      (draggedItem, monitor) => {
        const dropArea = document.getElementById('drop-area');
        const offset = monitor.getClientOffset();
        const boundingRect = dropArea.getBoundingClientRect();
        const x = offset.x - boundingRect.left;
        const y = offset.y - boundingRect.top;

        // Ensure the item is positioned without overlapping others
        const newPosition = findNonOverlappingPosition(x, y, itemSize.width, itemSize.height);
        onDrop(draggedItem, newPosition);
      },
      [onDrop, itemSize.width, itemSize.height, placedItems]
    ),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [showSizeBar, setShowSizeBar] = useState(false);

  const handleItemClick = (id, width, height) => {
    setSelectedItemId(id);
    setItemSize({ width, height });
    setShowSizeBar(true); // Show SizeBar on item click
  };

  const handleDragEnd = (id, e) => {
    const dropArea = document.getElementById('drop-area');
    const boundingRect = dropArea.getBoundingClientRect();
    const x = e.clientX - boundingRect.left;
    const y = e.clientY - boundingRect.top;

    // Ensure the item is positioned without overlapping others
    const newPosition = findNonOverlappingPosition(x, y, itemSize.width, itemSize.height);
    handleItemDrag(id, newPosition.x, newPosition.y);
  };

  const findNonOverlappingPosition = (x, y, width, height) => {
    const padding = 2; // Minimal padding between items
    let newX = x;
    let newY = y;

    const isOverlapping = (item) => {
      return !(
        newX + width + padding <= item.x || // Right side of the new item is left of the existing item
        newX >= item.x + item.width + padding || // Left side of the new item is right of the existing item
        newY + height + padding <= item.y || // Bottom side of the new item is above the existing item
        newY >= item.y + item.height + padding // Top side of the new item is below the existing item
      );
    };

    const adjustPosition = () => {
      for (const item of placedItems) {
        if (isOverlapping(item)) {
          // Adjust position: place the item just below the existing item
          newY = item.y + item.height + padding;
          return adjustPosition(); // Re-check with adjusted position
        }
      }
    };

    adjustPosition(); // Initial position check and adjustment
    return { x: newX, y: newY };
  };

  const handleItemDrag = (id, x, y) => {
    setPlacedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, x, y } : item
      )
    );
  };

  const applySize = () => {
    handleApplySize();
    setTimeout(() => {
      setShowSizeBar(false); // Hide SizeBar after 2 seconds
    }, 200);
  };

  return (
    
    <div id="drop-area" ref={drop} className="drop-area relative">
      <div>
      <button onClick={captureGrid} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Download Grid as PNG
      </button></div>.
      {placedItems.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
            border: '2px solid #333',
            cursor: 'move',
            backgroundColor: selectedItemId === item.id ? '#f0f0f0' : 'transparent',
          }}
          onClick={() => handleItemClick(item.id, item.width, item.height)}
          draggable
          onDragEnd={(e) => handleDragEnd(item.id, e)}
        >
          <DraggableGridItem
            item={item}
            style={{ width: item.width, height: item.height }}
          />
          {selectedItemId === item.id && showSizeBar && (
            <SizeBar
              itemSize={itemSize}
              setItemSize={setItemSize}
              handleApplySize={applySize}
            />
          )}
          {selectedItemId === item.id && (
            <div className="absolute top-0 left-0 p-1 bg-white shadow-md border border-gray-300">
              <button
                onClick={() => deleteItem(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded mb-2"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GridBoard;
