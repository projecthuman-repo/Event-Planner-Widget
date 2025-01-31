import * as React from "react";
import CanvasBoard from "../../featureComponents/Canvasboard";

const ProjectTabRightSection: React.FunctionComponent = () => {
  return (
    <div className="h-[100%] w-[100%] text-center place-content-center">
      <div className="h-[100%] w-[100%]">
          <CanvasBoard />
      </div>
    </div>
  );
};

export default ProjectTabRightSection;