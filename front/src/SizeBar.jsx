import React from 'react';

const SizeBar = ({ itemSize, setItemSize, handleApplySize }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemSize((prevSize) => ({
      ...prevSize,
      [name]: parseInt(value, 10),
    }));
  };

  return (
    <div className="size-bar bg-white p-4 border border-gray-300 shadow-md rounded">
      <h3 className="text-lg font-semibold mb-2">Adjust Size</h3>
      <div className="flex items-center mb-4">
        <label className="mr-2" htmlFor="width">Width:</label>
        <input
          type="number"
          id="width"
          name="width"
          value={itemSize.width}
          onChange={handleChange}
          className="border p-1 w-16"
        />
      </div>
      <div className="flex items-center mb-4">
        <label className="mr-2" htmlFor="height">Height:</label>
        <input
          type="number"
          id="height"
          name="height"
          value={itemSize.height}
          onChange={handleChange}
          className="border p-1 w-16"
        />
      </div>
      <button
        onClick={handleApplySize}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default SizeBar;
