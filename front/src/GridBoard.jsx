import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableGridItem from './DraggableGridItem';

const GridBoard = ({ placedItems, setPlacedItems }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'item',
    drop: (draggedItem, monitor) => {
      const dropArea = document.getElementById('drop-area');
      const offset = monitor.getClientOffset();
      const boundingRect = dropArea.getBoundingClientRect();

      const x = offset.x - boundingRect.left;
      const y = offset.y - boundingRect.top;

      // Ensure the item is placed accurately within the grid boundaries
      setPlacedItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex((item) => item.id === draggedItem.id);
        if (existingItemIndex > -1) {
          // Update the position of the existing item
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], x, y };
          return updatedItems;
        } else {
          // Add new item with accurate position
          return [...prevItems, { ...draggedItem, x, y, dropped: true }];
        }
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleDelete = (id) => {
    setPlacedItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div id="drop-area" ref={drop} className="drop-area relative">
      {placedItems.map(
        (item) =>
          item.dropped && (
            <DraggableGridItem
              key={item.id}
              item={item}
              style={{ top: `${item.y}px`, left: `${item.x}px`, position: 'absolute' }}
              onDelete={handleDelete}
            />
          )
      )}
    </div>
  );
};

export default GridBoard;
