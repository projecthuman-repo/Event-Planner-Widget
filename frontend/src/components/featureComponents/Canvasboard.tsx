import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { useDrop } from "react-dnd";
import { FaMinus, FaPlus } from "react-icons/fa";

const CanvasBoard: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1); // Default: 1px = 1 meter
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);

  // Define grid cell size in pixels
  const gridSize = 50;

  // Handle Scale Input Change
  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (value > 0) setScale(value);
  };

  // React DND Drop logic
  const [, drop] = useDrop(() => ({
    accept: ["Chair", "Table"],
    drop: (item: { type: string; label: string }, monitor) => {
      if (!canvasRef.current) return;

      const clientOffset = monitor.getSourceClientOffset();
      if (!clientOffset) return;

      const pointer = canvasRef.current.getPointer({
        clientX: clientOffset.x,
        clientY: clientOffset.y,
      } as MouseEvent);

      // If snapping is enabled, adjust the pointer to the nearest grid intersection
      if (snapEnabled) {
        pointer.x = Math.round(pointer.x / gridSize) * gridSize;
        pointer.y = Math.round(pointer.y / gridSize) * gridSize;
      }

      const rect = new fabric.Rect({
        left: pointer.x ?? 0,
        top: pointer.y ?? 0,
        fill: item.type === "Chair" ? "blue" : "green",
        width: 50,
        height: 50,
        selectable: true,
      });

      canvasRef.current.add(rect);
      canvasRef.current.renderAll();
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

    // Add grid overlay and scale bar after canvas initialization
    addGridOverlay();
    createScaleBar();

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

    // Clean up on unmount
    return () => {
      canvas.dispose();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Function to add a grid overlay using a repeating pattern
  const addGridOverlay = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Create an off-screen canvas to define the grid pattern
    const gridCanvas = document.createElement("canvas");
    gridCanvas.width = gridSize;
    gridCanvas.height = gridSize;
    const ctx = gridCanvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, gridSize);
      ctx.moveTo(0, 0);
      ctx.lineTo(gridSize, 0);
      ctx.stroke();
    }

    const gridPattern = new fabric.Pattern({
      source: gridCanvas,
      repeat: "repeat",
    });

    // Remove any existing grid overlay
    const existingGrid = canvas.getObjects().find((obj) => (obj as any).isGrid);
    if (existingGrid) {
      canvas.remove(existingGrid);
    }

    // Provide fallback for getWidth()/getHeight() in case they're typed as possibly undefined
    const width: number = canvas.getWidth() ?? 800;
    const height: number = canvas.getHeight() ?? 600;

    const gridRect = new fabric.Rect({
      left: 0,
      top: 0,
      width,
      height,
      fill: gridPattern,
      selectable: false,
      evented: false,
    }) as fabric.Rect;
    (gridRect as any).isGrid = true;

    // Insert the grid at index 0 in the stack (behind everything)
    canvas.insertAt(0, gridRect);
    canvas.renderAll();
  };

  // Function to create/update the scale bar (graph scale) at the bottom left of the canvas
  const createScaleBar = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Remove existing scale bar if any
    const existingScaleBar = canvas
      .getObjects()
      .find((obj) => (obj as any).scaleBar);
    if (existingScaleBar) {
      canvas.remove(existingScaleBar);
    }

    const barLengthMeters = 100; // Fixed physical length for the scale bar (e.g., 100 meters)

    // Provide fallback values in case getZoom()/getHeight() are typed as possibly undefined
    const currentZoom: number = canvas.getZoom() ?? 1;
    const currentHeight: number = canvas.getHeight() ?? 600;

    // Calculate the length in pixels: since scale is 1px = 'scale' meters,
    // pixels = physicalLength / scale, adjusted by current zoom
    const barLengthPx = (barLengthMeters / scale) * currentZoom;

    const margin = 10;
    const x = margin;
    const y = currentHeight - margin - 10; // 10px above the bottom

    // Force TypeScript to see definite [number, number, number, number]
    const lineCoords = [x, y, x + barLengthPx, y] as [number, number, number, number];
    const line = new fabric.Line(lineCoords, {
      stroke: "black",
      strokeWidth: 2,
      selectable: false,
      evented: false,
    }) as fabric.Line;

    const text = new fabric.Text(`${barLengthMeters} m`, {
      left: x + barLengthPx / 2,
      top: y - 20,
      fontSize: 12,
      originX: "center",
      selectable: false,
      evented: false,
    }) as fabric.Text;

    // Cast each item to fabric.Object to match the Group constructor's signature
    const groupItems = [line as fabric.Object, text as fabric.Object];
    const scaleBarGroup = new fabric.Group(groupItems, {
      selectable: false,
      evented: false,
    }) as fabric.Group;
    (scaleBarGroup as any).scaleBar = true;

    // Insert the scale bar group at index 0 in the stack (behind everything)
    canvas.insertAt(0, scaleBarGroup);
    canvas.renderAll();
  };

  // Zoom control functions
  const zoomIn = () => {
    if (canvasRef.current) {
      const newZoom = (canvasRef.current.getZoom() ?? 1) * 1.1;
      canvasRef.current.setZoom(newZoom);
      addGridOverlay();
      createScaleBar();
    }
  };

  const zoomOut = () => {
    if (canvasRef.current) {
      const newZoom = (canvasRef.current.getZoom() ?? 1) / 1.1;
      canvasRef.current.setZoom(newZoom);
      addGridOverlay();
      createScaleBar();
    }
  };

  // Function to Set Background Image
  const setCanvasBackground = (imageUrl: string) => {
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = "anonymous"; // ✅ Fix CORS issues

    img.onload = () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const fallbackWidth = canvas.width ?? 800;
      const fallbackHeight = canvas.height ?? 600;

      const fabricImg = new fabric.Image(img, {
        originX: "left",
        originY: "top",
        scaleX: fallbackWidth / img.width,
        scaleY: fallbackHeight / img.height,
      }) as fabric.Image;

      // Using `.set()` instead of `setBackgroundImage()`
      canvas.set("backgroundImage", fabricImg);
      canvas.renderAll();
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

      // Also download locally
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas-export.png";
      link.click();
    } catch (error) {
      console.error("Failed to export canvas:", error);
    }
  };

  return (
    <div ref={drop} className="w-[99%] h-[90%] mt-1 ml-2">
      {/* ✅ Scale Input */}
      <div className="flex items-center gap-2 mb-2">
        <label className="text-gray-600 font-bold">Scale (1px = ? meters):</label>
        <input
          type="number"
          value={scale}
          onChange={handleScaleChange}
          className="border p-1 w-16 text-center rounded-md"
        />
        <label className="flex items-center gap-1 text-gray-600">
          <input
            type="checkbox"
            checked={snapEnabled}
            onChange={(e) => setSnapEnabled(e.target.checked)}
          />
          Snap to Grid
        </label>
      </div>

      {/* ✅ Canvas */}
      <canvas id="canvas" className="w-[100%] h-[100%] border-2 border-gray-400" />

      <div className="flex h-[10%] w-[100%] place-items-center">
        {/* ✅ Export Button */}
        <div className="w-[130px]">
          <button
            onClick={exportCanvas}
            className="bg-[#007BFF] p-1 pl-2 pr-2 rounded-[10px] text-white font-bold cursor-pointer"
          >
            Export Canvas
          </button>
        </div>

        {/* ✅ Zoom & Upload Controls */}
        <div className="flex gap-3 w-[calc(100%-130px)] place-items-center place-content-center justify-center text-center">
          <button onClick={zoomIn} className="place-items-center place-content-center cursor-pointer">
            <FaPlus />
            <div className="text-[10px]">Zoom In</div>
          </button>
          <button onClick={zoomOut} className="place-items-center place-content-center cursor-pointer">
            <FaMinus />
            <div className="text-[10px]">Zoom Out</div>
          </button>

          {/* ✅ Upload Floor Plan */}
          <input type="file" accept="image/*" onChange={handleFileSelect} />
          <button
            onClick={handleUploadBackground}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
              width: "200px",
              marginTop: "10px",
            }}
          >
            Upload Floor Plan
          </button>

          {/* ✅ Remove Background */}
          {backgroundImage && (
            <button
              onClick={handleRemoveBackground}
              style={{
                padding: "10px 20px",
                backgroundColor: "#DC3545",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
                width: "200px",
                marginTop: "10px",
              }}
            >
              Remove Background
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasBoard;