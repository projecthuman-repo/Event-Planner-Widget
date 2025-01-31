import * as React from 'react';
import { useTabContext } from '../../context/TabsContext';

interface Tab {
    name: string;
}

interface TabsProps {
    tabs: Tab[];
}

const TabsComponent: React.FunctionComponent<TabsProps> = ({ tabs }) => {
    const { activeTab, setActiveTab } = useTabContext();

  return (
    <div className='flex place-content-center gap-1'>
        {tabs.map((tab) => (
            <button 
                key={tab.name}
                className={`w-[25%] border-b-4 font-bold cursor-pointer ${activeTab === tab.name ? 'border-b-green-300 text-green-300' : 'border-b-gray-400 text-gray-400'}`}
                onClick={() => setActiveTab(tab.name)}
            >
                {tab.name}
            </button>
        ))}
    </div>
  );
};

export default TabsComponent;
