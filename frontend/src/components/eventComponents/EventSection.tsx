import * as React from "react";
import TabsComponent from "./TabsComponent";
import { TabProvider } from "../../context/TabsContext";
import TabRendering from "./TabRendering";

const EventSection: React.FunctionComponent = () => {

  const tabs = [
    { name: "Guild Overview" },
    { name: "Programs" },
    { name: "Projects" },
    { name: "Something" },
  ];

  return (
    <TabProvider>
      <section className="w-[100%] h-[100%] p-5">
        <p className="text-3xl font-bold">Event Planner</p>
        <div className="w-[100%] h-[75vh] place-content-center mt-3">
          <TabsComponent tabs={tabs} />

          <div className="h-[100%] w-[100%]">
            <TabRendering />
          </div>
        </div>
      </section>
    </TabProvider>
  );
};

export default EventSection;
