// src/ESPLayout.jsx
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
    // Add more items here if needed
  ]);

  const [placedItems, setPlacedItems] = useState([]);

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
            <GridBoard placedItems={placedItems} setPlacedItems={setPlacedItems} />
          </main>
        </div>
      </div>
    </DndProvider>
  );
}

export default ESPLayout;
