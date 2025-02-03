import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { useDrop } from "react-dnd";

const CanvasBoard: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Drag & Drop for Furniture
  const [, drop] = useDrop(() => ({
    accept: ["chair", "table"],
    drop: (item: { type: string; label: string }, monitor) => {
      if (!canvasRef.current) return;
  
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
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
          selectable: true,
        });
  
        canvasRef.current.add(rect);
        canvasRef.current.renderAll();
      }
    },
  }));

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: 800,
      height: 600,
      backgroundColor: "#fff",
    });
    canvasRef.current = canvas;

    // Fetch stored background image from backend
    const fetchFloorPlan = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/export/get-floorplan");
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

    return () => {
      canvas.dispose();
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
      const response = await fetch("http://localhost:3000/api/export/upload-floorplan", {
        method: "POST",
        body: formData,
      });

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

  // Export Canvas to Backend
  const exportCanvas = async () => {
    if (!canvasRef.current) return;

    try {
      const dataURL = canvasRef.current.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 2, 
        enableRetinaScaling: true,
      });

      const response = await fetch("http://localhost:3000/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layoutData: dataURL }),
      });

      const result = await response.json();
      if (result.imageUrl) {
        const link = document.createElement("a");
        link.href = `http://localhost:3000${result.imageUrl}`;
        link.download = "canvas-export.png";
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error("Failed to export canvas:", error);
    }
  };

  return (
    <div ref={drop} style={{ flex: 1, padding: "20px", border: "2px solid #ccc", minHeight: "700px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Upload Section */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
        <input type="file" accept="image/*" onChange={handleFileSelect} style={{ marginBottom: "10px", padding: "5px", border: "1px solid #ccc", borderRadius: "5px", width: "250px" }} />

        <button onClick={handleUploadBackground} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", borderRadius: "5px", cursor: "pointer", width: "200px" }}>
          Upload Floor Plan
        </button>

        {backgroundImage && (
          <button onClick={handleRemoveBackground} style={{ padding: "10px 20px", backgroundColor: "#DC3545", color: "#fff", borderRadius: "5px", cursor: "pointer", width: "200px", marginTop: "10px" }}>
            Remove Background
          </button>
        )}
      </div>

      {/* Canvas */}
      <canvas id="canvas" style={{ border: "1px solid #ccc", maxWidth: "100%", width: "800px", height: "600px" }} />

      {/* Export Button */}
      <button onClick={exportCanvas} style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#007BFF", color: "#fff", borderRadius: "5px", cursor: "pointer", width: "200px" }}>
        Export Canvas
      </button>
    </div>
  );
};

export default CanvasBoard;