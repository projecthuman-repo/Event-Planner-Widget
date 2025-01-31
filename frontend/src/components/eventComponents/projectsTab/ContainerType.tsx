import * as React from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import Container from "./Container";

interface ContainerTypeProps {
  Type: string;
  Items: [string, React.ReactNode][]; // Ensure Items is an array of [label, icon] pairs
}

const ContainerType: React.FC<ContainerTypeProps> = ({ Type, Items }) => {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <button
        className="flex h-[30px] mt-2 place-items-center cursor-pointer"
        onClick={() => setShow(!show)}
      >
        {!show ? <FaPlus className="size-[20px] text-gray-400" /> : <FaMinus className="size-[20px] text-gray-400" />}
        <p className="ml-1.5">{Type}</p>
      </button>

      {show && (
        <div className="grid grid-cols-3 ml-[30px] mt-2 gap-4">
          {Items.map(([label, icon], index) => (
            <Container key={index} type={Type} label={label} icon={icon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContainerType;
