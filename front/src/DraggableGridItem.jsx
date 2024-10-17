// src/DraggableGridItem.jsx
import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableGridItem = ({ item, style }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    item: { id: item.id, type: item.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="draggable-item"
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        border: '2px solid #ccc',
        boxSizing: 'border-box',
      }}
    >
      <img src={item.imageUrl} alt={item.type} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default DraggableGridItem;
