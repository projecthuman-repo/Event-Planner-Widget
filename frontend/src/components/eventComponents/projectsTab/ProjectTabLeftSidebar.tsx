import * as React from "react";
import CreateProjects from "./CreateProject";
import ContainerType from "./ContainerType";
import { FaChair } from "react-icons/fa";
import { MdChair, MdOutlineTableRestaurant, MdTableBar } from "react-icons/md";
import { GiTable, GiWoodenChair } from "react-icons/gi";
import { PiChairFill, PiOfficeChair } from "react-icons/pi";
import { CustomScroll } from "react-custom-scroll";
import { SiAirtable } from "react-icons/si";

const ProjectTabLeftSidebar: React.FunctionComponent = () => {
  return (
    <div className="h-[100%] w-[20%]">
      <CreateProjects />
      <div className="text-xl font-bold pb-2 ">My Calendar</div>
      <div className="h-[2px] bg-gray-400"></div>

      <CustomScroll heightRelativeToParent="75%" className="">
      <div>
        <ContainerType
          Type="Chair"
          Items={[
            ["FaChair",<FaChair className="size-[30px]" />],
            ["MdChair",<MdChair className="size-[30px]" />],
            ["GiWoodenChair",<GiWoodenChair className="size-[30px]" />],
            ["PiOfficeChair",<PiOfficeChair className="size-[30px]" />],
            ["PiChairFill",<PiChairFill className="size-[30px]" />],
          ]}
        />
        <ContainerType
          Type="Table"
          Items={[
            ["MdOutlineTableRestaurant",<MdOutlineTableRestaurant className="size-[30px]" />],
            ["MdTableBar",<MdTableBar className="size-[30px]" />],
            ["GiTable",<GiTable className="size-[30px]" />],
            ["SiAirtable",<SiAirtable className="size-[30px]" />],
          ]}
        />
      </div>
      </CustomScroll>
    </div>
  );
};

export default ProjectTabLeftSidebar;
