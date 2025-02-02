import * as React from "react";
import { useDrag } from "react-dnd";

interface ContainerProps {
    type: string,
    label: string,
    icon: React.ReactNode
}

const Container: React.FunctionComponent<ContainerProps> = ({ type, label, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { type: type, label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={`bg-green-200 w-[40px] h-[40px] content-center place-items-center hover:cursor-pointer ${isDragging ? "opacity-50" : "opacity-100"}`} >
      {icon}
    </div>
  );
};

export default Container;