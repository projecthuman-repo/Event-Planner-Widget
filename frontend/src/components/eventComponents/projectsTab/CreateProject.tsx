import * as React from "react";
import { FaPlusCircle } from "react-icons/fa";

const CreateProjects: React.FunctionComponent = () => {
  return (
    <div className="h-[50px] w-[100%] content-center">
      <button className="flex place-items-center">
        <FaPlusCircle className="size-[25px] text-blue-500 cursor-pointer hover:text-blue-700"/>
        <p className="font-bold ml-1.5">Create New</p>
      </button>
    </div>
  );
};

export default CreateProjects;
