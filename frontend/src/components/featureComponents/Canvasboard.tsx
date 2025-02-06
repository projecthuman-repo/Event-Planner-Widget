import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { useDrop } from "react-dnd";
import { FaMinus, FaPlus } from "react-icons/fa";

const CanvasBoard: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // React DND Drop logic
  const [, drop] = useDrop(() => ({
    accept: ["Chair", "Table"],
    drop: (item: { type: string; label: string }, monitor) => {
      if (!canvasRef.current) return;

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
        canvasRef.current.renderAll();
      }
    },
  }));

  // Initialize Fabric.js canvas
  useEffect(() => {
    const canvasElement = document.getElementById("canvas");
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

    // Fetch stored background image from backend
    const fetchFloorPlan = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/export/get-floorplan"
        );
        const data = await res.json();

        if (data.imageUrl) {
          setBackgroundImage(`http://localhost:3000${data.imageUrl}`);
          setCanvasBackground(`http://localhost:3000${data.imageUrl}`);
        }
      } catch (error) {
        console.error("Error fetching floor plan:", error);
      }
    };

    fetchFloorPlan();

    // Clean up on unmount
    return () => {
      canvas.dispose();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Function to Set Background Image
  const setCanvasBackground = (imageUrl: string) => {
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = "anonymous"; // ✅ Fix CORS issues

    img.onload = () => {
      if (!canvasRef.current) return;

      const fabricImg = new fabric.Image(img, {
        originX: "left",
        originY: "top",
        scaleX: (canvasRef.current.width || 800) / img.width,
        scaleY: (canvasRef.current.height || 600) / img.height,
      });

      // Using `.set()` instead of `setBackgroundImage()`
      canvasRef.current.set("backgroundImage", fabricImg);
      canvasRef.current.renderAll();
    };
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  // Upload Floor Plan to Backend
  const handleUploadBackground = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("floorPlan", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:3000/api/export/upload-floorplan",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.imageUrl) {
        setBackgroundImage(`http://localhost:3000${result.imageUrl}`);
        setCanvasBackground(`http://localhost:3000${result.imageUrl}`);
      }
    } catch (error) {
      console.error("Failed to upload floor plan:", error);
    }
  };

  // Remove Background & Inform Backend
  const handleRemoveBackground = async () => {
    if (canvasRef.current) {
      canvasRef.current.set("backgroundImage", null);
      canvasRef.current.renderAll();
      setBackgroundImage(null);

      try {
        await fetch("http://localhost:3000/api/export/remove-floorplan", {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to remove floor plan:", error);
      }
    }
  };

  // Function to export canvas as an image
  const exportCanvas = async () => {
    if (!canvasRef.current) return;

    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 2,
        enableRetinaScaling: true,
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
        
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "canvas-export.png";
        //document.body.appendChild(link);
        link.click();

      } catch (error) {
        console.error("Failed to export canvas:", error);
      }
    } else {
      console.error("Canvas is not initialized!");
    }
  };

  return (
    <div ref={drop} className="w-[99%] h-[90%] mt-1 ml-2">
      {/* <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
        <input type="file" accept="image/*" onChange={handleFileSelect} style={{ marginBottom: "10px", padding: "5px", border: "1px solid #ccc", borderRadius: "5px", width: "250px" }} />

        <button onClick={handleUploadBackground} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", borderRadius: "5px", cursor: "pointer", width: "200px" }}>
          Upload Floor Plan
        </button>

        {backgroundImage && (
          <button onClick={handleRemoveBackground} style={{ padding: "10px 20px", backgroundColor: "#DC3545", color: "#fff", borderRadius: "5px", cursor: "pointer", width: "200px", marginTop: "10px" }}>
            Remove Background
          </button>
        )}
      </div> */}
      <canvas
        id="canvas"
        className="w-[100%] h-[100%] border-2 border-gray-400"
      />
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
            <div className="text-[10px]">Zoom In</div>
          </button>
          <button className="place-items-center place-content-center cursor-pointer">
            <FaMinus />
            <div className="text-[10px]">Zoom Out</div>
          </button>
          <input type="file" accept="image/*" onChange={handleFileSelect} />
          <button onClick={handleUploadBackground} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", borderRadius: "5px", cursor: "pointer", width: "200px", marginTop: "10px"  }}>
          Upload Floor Plan
        </button>
        {backgroundImage && (
          <button onClick={handleRemoveBackground} style={{ padding: "10px 20px", backgroundColor: "#DC3545", color: "#fff", borderRadius: "5px", cursor: "pointer", width: "200px", marginTop: "10px" }}>
            Remove Background
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default CanvasBoard;
