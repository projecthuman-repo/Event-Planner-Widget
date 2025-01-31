import * as React from 'react';
import ProjectTabLeftSidebar from './ProjectTabLeftSidebar';
import ProjectTabRightSection from './ProjectsTabRightSection';

const ProjectsTabSection: React.FunctionComponent = () => {
  return (
    <div className='flex h-[100%] w-[100%]'>
      <ProjectTabLeftSidebar />
      <div className='h-[99%] w-[100%]'>
        <ProjectTabRightSection />
      </div>
    </div>
  );
};

export default ProjectsTabSection;
