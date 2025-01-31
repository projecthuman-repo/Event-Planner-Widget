import React, { useEffect, useRef } from "react";
import * as fabric from "fabric"; // Importing fabric.js should be LIKE this
import { useDrop } from "react-dnd";

const CanvasBoard: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);

  // React DND Drop logic
  const [, drop] = useDrop(() => ({
    accept: ["chair", "table"],
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
          fill: item.type === "chair" ? "blue" : "green",
          width: 50,
          height: 50,
        });
        canvasRef.current.add(rect);
      }
    },
  }));

  // Initialize Fabric.js canvas
  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: 800,
      height: 600,
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
      style={{ flex: 1, padding: "10px", border: "10px solid #ccc" }}
    >
      <canvas id="canvas" />
      {/* Add a button to trigger the export feature */}
      <button
        onClick={exportCanvas}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Export Canvas
      </button>
    </div>
  );
};

export default CanvasBoard;