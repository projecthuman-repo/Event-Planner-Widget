import * as React from 'react';

interface TabContextProps {
    activeTab: string;
    setActiveTab: (name: string) => void;
}

const TabCotext = React.createContext<TabContextProps | undefined>(undefined)

export const TabProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = React.useState('Projects');
    
  return (
    <TabCotext.Provider value={{ activeTab, setActiveTab }}>
        {children}
    </TabCotext.Provider>
  );
};

export const useTabContext = () => {
    const context = React.useContext(TabCotext);
    if(!context){
        throw new Error('useTabContext must be used within a TabProvider')
    }
    return context;
}