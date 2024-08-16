import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableGridItem = ({ item, onDelete, style }) => {
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
      style={{ ...style, opacity: isDragging ? 0.5 : 1 }}
    >
      <img src={item.imageUrl} alt={item.type} />
      <button className="delete-button" onClick={() => onDelete(item.id)}>
        &times;
      </button>
    </div>
  );
};

export default DraggableGridItem;
