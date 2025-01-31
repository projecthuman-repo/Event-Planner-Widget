import * as React from 'react';
import { useTabContext } from '../../context/TabsContext';
import ProjectsTabSection from './projectsTab/ProjectsTabSection';
import GuildOverviewTab from './guildOverview/GuildOverviewTab';
import ProgramsTab from './programs/ProgramsTab';
import SomethingTab from './something/SomethingTab';

const TabRendering: React.FunctionComponent = () => {
    const { activeTab } = useTabContext();
    
  return (
    <div className='w-[100%] h-[100%]'>
        {activeTab === 'Guild Overview' && <GuildOverviewTab />}
        {activeTab === 'Programs' && <ProgramsTab />}
        {activeTab === 'Projects' && <ProjectsTabSection />}
        {activeTab === 'Something' && <SomethingTab />}
    </div>
  );
};

export default TabRendering;
