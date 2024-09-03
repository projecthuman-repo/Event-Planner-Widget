import React from 'react';

const GridSizeSelector = ({ stageShape, onSizeChange, currentSize }) => {
  const getSizeOptions = () => {
    if (stageShape === 'circle') {
      return [
        { value: 1, label: 'Small' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'Large' },
      ];
    } else if (stageShape === 'rectangle') {
      return [
        { value: 30, label: '6x5' },
        { value: 35, label: '7x5' },
        { value: 42, label: '7x6' },
      ];
    } else {
      return [
        { value: 4, label: '2x2' },
        { value: 9, label: '3x3' },
        { value: 16, label: '4x4' },
        { value: 25, label: '5x5' },
      ];
    }
  };

  const options = getSizeOptions();

  return (
    <select 
      value={currentSize}
      onChange={(e) => onSizeChange(Number(e.target.value))}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default GridSizeSelector;