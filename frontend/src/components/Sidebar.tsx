// src/components/Sidebar.tsx
import React from 'react';
import { useDrag } from 'react-dnd';

type SidebarItemProps = {
  type: string;
  label: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { type, label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        border: '1px solid #ccc',
        marginBottom: '5px',
        background: '#f9f9f9',
        cursor: 'grab',
      }}
    >
      {label}
    </div>
  );
};

const Sidebar: React.FC = () => (
  <div style={{ width: '200px', background: '#e8e8e8', padding: '10px' }}>
    <h3>Furniture</h3>
    <SidebarItem type="chair" label="Chair" />
    <SidebarItem type="table" label="Table" />
  </div>
);

export default Sidebar;