import React, { useState, useEffect } from 'react';
import GridBoard from './GridBoard';
import DraggableGridItem from './DraggableGridItem';
import GridSizeSelector from './GridSizeSelector';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function ESPLayout() {
  const [availableItems] = useState([
    { id: 'table', type: 'Table', imageUrl: 'https://via.placeholder.com/50?text=Table' },
    { id: 'chair', type: 'Chair', imageUrl: 'https://via.placeholder.com/50?text=Chair' },
    { id: 'lamp', type: 'Lamp', imageUrl: 'https://via.placeholder.com/50?text=Lamp' },
    { id: 'podium', type: 'Podium', imageUrl: 'https://via.placeholder.com/50?text=Podium' },
  ]);

  const [gridSize, setGridSize] = useState(4); // Default to 2x2 square
  const [stageShape, setStageShape] = useState('square');
  const [placedItems, setPlacedItems] = useState([]);

  useEffect(() => {
    // Reset grid size when changing shapes
    if (stageShape === 'circle') {
      setGridSize(1);
    } else if (stageShape === 'rectangle') {
      setGridSize(30); // 6x5 is the default rectangle option
    } else {
      setGridSize(4); // 2x2 is the default square option
    }
  }, [stageShape]);

  const handleGridSizeChange = (newSize) => {
    setGridSize(newSize);
    setPlacedItems([]);
  };

  const handleStageShapeChange = (event) => {
    const newShape = event.target.value;
    setStageShape(newShape);
    setPlacedItems([]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <header>
          <h1>Event Space Preview</h1>
          <div>
            <label htmlFor="stage-shape">Stage Shape: </label>
            <select id="stage-shape" value={stageShape} onChange={handleStageShapeChange}>
              <option value="square">Square</option>
              <option value="circle">Circle</option>
              <option value="rectangle">Rectangle</option>
            </select>
            <label htmlFor="grid-size" style={{ marginLeft: '1rem' }}>
              {stageShape === 'circle' ? 'Circle Size: ' : 'Grid Size: '}
            </label>
            <GridSizeSelector 
              stageShape={stageShape} 
              onSizeChange={handleGridSizeChange}
              currentSize={gridSize}
            />
          </div>
        </header>
        <div style={{ display: 'flex', flex: 1 }}>
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
              setPlacedItems={setPlacedItems}
              gridSize={gridSize}
              stageShape={stageShape}
            />
          </main>
        </div>
      </div>
    </DndProvider>
  );
}

export default ESPLayout;