import React, { useEffect, useRef } from "react";
import * as fabric from "fabric"; // Importing fabric.js should be LIKE this
import { useDrop } from "react-dnd";
import { FaMinus, FaPlus } from "react-icons/fa6";

const CanvasBoard: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);

  // React DND Drop logic
  const [, drop] = useDrop(() => ({
    accept: ["Chair", "Table"],
    drop: (item: { type: string; label: string }, monitor) => {
      console.log(`Dropped item: ${item.label} of type: ${item.type}`);

      const clientOffset = monitor.getClientOffset();
      if (clientOffset && canvasRef.current) {
        const pointer = canvasRef.current.getPointer({
          clientX: clientOffset.x,
          clientY: clientOffset.y,
        } as MouseEvent);

        const rect = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          fill: item.type === "Chair" ? "blue" : "green",
          width: 50,
          height: 50,
        });
        canvasRef.current.add(rect);
      }
    },
  }));

  // Initialize Fabric.js canvas
  useEffect(() => {
    const canvasElement = document.getElementById("canvas")
    const canvas = new fabric.Canvas("canvas", {
      width: canvasElement?.clientWidth,
      height: canvasElement?.clientHeight,
      backgroundColor: "#fff",
    });
    canvasRef.current = canvas;

    // Event listener for delete key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        canvas.getActiveObject()
      ) {
        canvas.remove(canvas.getActiveObject()!);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Clean up on unmount
    return () => {
      canvas.dispose();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Function to export canvas as an image
  const exportCanvas = async () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 1, // Scale the resolution of the exported image
      });
  
      try {
        // Send data to the backend
        const response = await fetch("http://localhost:3000/api/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ layoutData: dataURL }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to export canvas to the backend");
        }
  
        const result = await response.json();
        console.log(result.message);
        alert("Canvas exported successfully to the backend!");
  
        // Save the canvas as a local PNG file
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "canvas-export.png"; // Set the filename for download
        link.click(); // Trigger the download
      } catch (error) {
        console.error("Failed to export canvas:", error);
      }
    } else {
      console.error("Canvas is not initialized!");
    }
  };

   
   /*const exportCanvas = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 1, // Scale the resolution of the exported image
      });

      // Create a link element to download the image
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas-export.png";
      link.click();
    } else {
      console.error("Canvas is not initialized!");
    }
  };*/


  return (
    <div 
      ref={drop}
      className="w-[99%] h-[99%] mt-1 ml-2"
    >
      <canvas id="canvas" className="w-[100%] h-[90%] border-2 border-gray-400" />

      <div className="flex h-[10%] w-[100%] place-items-center">
        <div className="w-[130px]">
          <button 
            onClick={exportCanvas}
            className="bg-[#007BFF] p-1 pl-2 pr-2 rounded-[10px] text-white font-bold cursor-pointer"
          >
            Export Canvas
          </button>
        </div>
        <div className="flex gap-3 w-[calc(100%-130px)] place-items-center place-content-center justify-center text-center">
          <button className="place-items-center place-content-center cursor-pointer">
            <FaPlus />
            <div className="text-[10px]">
              Zoom In
            </div>
          </button>
          <button className="place-items-center place-content-center cursor-pointer">
            <FaMinus />
            <div className="text-[10px]">
              Zoom Out
            </div>
          </button>
        </div>
      </div>
      {/* Add a button to trigger the export feature */}
    </div>
    // <div
    //   ref={drop}
    //   style={{ flex: 1, padding: "10px", border: "10px solid #ccc" }}
    // >
    //   <canvas id="canvas" />
    //   {/* Add a button to trigger the export feature */}
    //   <button
    //     onClick={exportCanvas}
    //     style={{
    //       marginTop: "10px",
    //       padding: "10px 20px",
    //       backgroundColor: "#007BFF",
    //       color: "#fff",
    //       border: "none",
    //       borderRadius: "5px",
    //       cursor: "pointer",
    //     }}
    //   >
    //     Export Canvas
    //   </button>
    // </div>
  );
};

export default CanvasBoard;