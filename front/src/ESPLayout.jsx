import React, { useState } from 'react';
import GridBoard from './GridBoard';
import DraggableGridItem from './DraggableGridItem';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function ESPLayout() {
  const [availableItems] = useState([
    { id: 'table', type: 'Table', imageUrl: 'https://via.placeholder.com/50?text=Table' },
    { id: 'chair', type: 'Chair', imageUrl: 'https://via.placeholder.com/50?text=Chair' },
    { id: 'lamp', type: 'Lamp', imageUrl: 'https://via.placeholder.com/50?text=Lamp' },
    { id: 'podium', type: 'Podium', imageUrl: 'https://via.placeholder.com/50?text=Podium' },
  ]);

  const [placedItems, setPlacedItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemSize, setItemSize] = useState({ width: 100, height: 100 });

  const handleDrop = (item, newPosition) => {
    const existingItem = placedItems.find((placedItem) => placedItem.id === item.id);
  
    if (existingItem) {
      setPlacedItems((prevItems) =>
        prevItems.map((placedItem) =>
          placedItem.id === item.id
            ? { ...placedItem, x: newPosition.x, y: newPosition.y }
            : placedItem
        )
      );
    } else {
      setPlacedItems((prevItems) => [
        ...prevItems,
        {
          ...item,
          id: `${item.id}-${prevItems.length}`,
          x: newPosition.x,
          y: newPosition.y,
          width: itemSize.width,
          height: itemSize.height,
          dropped: true,
        },
      ]);
    }
  };
  
  

  const handleApplySize = () => {
    setPlacedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedItemId ? { ...item, width: itemSize.width, height: itemSize.height } : item
      )
    );
    setSelectedItemId(null); // Deselect the item to hide the size changer
  };

  const deleteItem = (id) => {
    setPlacedItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setSelectedItemId(null); // Deselect the item
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-semibold">Event Space Preview</h1>
        </header>
        <div className="flex flex-1">
          <aside className="bg-gray-100 w-1/4 p-4 border-r border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Available Items</h2>
            <ul>
              {availableItems.map((item) => (
                <li key={item.id} className="mb-2">
                  <DraggableGridItem item={item} isPreview />
                </li>
              ))}
            </ul>
          </aside>
          <main className="flex-1 p-4">
            <GridBoard
              placedItems={placedItems}
              onDrop={handleDrop}
              selectedItemId={selectedItemId}
              setSelectedItemId={setSelectedItemId}
              itemSize={itemSize}
              setItemSize={setItemSize}
              handleApplySize={handleApplySize}
              deleteItem={deleteItem} // Pass delete function to GridBoard
            />
          </main>
        </div>
      </div>
    </DndProvider>
  );
}

export default ESPLayout;
