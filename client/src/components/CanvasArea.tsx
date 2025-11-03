import { useRef, useEffect, useState } from "react";
import { Canvas, PencilBrush, IText, Rect, Circle, Triangle, Line, Point, Polygon, Group, FabricImage, type TEvent, type FabricObject } from "fabric";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Copy,
  Clipboard,
  Trash2,
  CopyPlus,
  MoveUp,
  MoveDown,
  Lock,
  Unlock,
} from "lucide-react";

interface CanvasAreaProps {
  activeTool: string;
  strokeColor: string;
  fillColor: string;
  textColor: string;
  zoom: number;
  penSize: number;
  penOpacity: number;
  penType: string;
  eraserSize: number;
  textSize: number;
  textAlign: string;
  showGrid: boolean;
  currentCanvasCode?: string;
  onCanvasReady?: (canvas: Canvas) => void;
  onShapeComplete?: () => void;
  onZoomChange?: (zoom: number) => void;
}

export function CanvasArea(props: CanvasAreaProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const isPanningRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCustomCursor, setShowCustomCursor] = useState(false);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    // Create large canvas optimized for performance (5000x5000px)
    const canvas = new Canvas(canvasRef.current, {
      width: 5000,
      height: 5000,
      backgroundColor: "#ffffff",
      renderOnAddRemove: true,
      enableRetinaScaling: true,
      allowTouchScrolling: true,
    });

    fabricCanvasRef.current = canvas;
    if (props.onCanvasReady) props.onCanvasReady(canvas);

    // Center viewport on canvas initially
    const viewportWidth = window.innerWidth - 28;
    const viewportHeight = window.innerHeight;
    canvas.viewportTransform = [1, 0, 0, 1, -2500 + viewportWidth / 2, -2500 + viewportHeight / 2];
    canvas.renderAll();

    // No resize handler needed - canvas stays at fixed large dimensions
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Update canvas zoom
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const zoomLevel = props.zoom / 100;
    
    const center = canvas.getCenter();
    canvas.zoomToPoint(
      new Point(center.left, center.top),
      zoomLevel
    );
  }, [props.zoom]);

  // Update canvas background based on grid toggle
  // When grid is enabled, make canvas transparent to show CSS grid background
  // When grid is disabled, show white background
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    canvas.backgroundColor = props.showGrid ? "transparent" : "#ffffff";
    canvas.renderAll();
  }, [props.showGrid]);

  // Handle pan tool with middle mouse, shift+drag, or space+drag
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    let spacePressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if editing Fabric text or HTML input
      const target = e.target as HTMLElement;
      const activeObject = canvas.getActiveObject();
      const isEditingText = activeObject && (activeObject as any).isEditing;
      const isHTMLInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      
      if (e.code === "Space" && !spacePressed && !isHTMLInput && !isEditingText) {
        e.preventDefault();
        spacePressed = true;
        if (!isPanningRef.current) {
          canvas.defaultCursor = "grab";
          canvas.renderAll();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spacePressed = false;
        if (!isPanningRef.current) {
          canvas.defaultCursor = getCursorForTool(props.activeTool);
          canvas.renderAll();
        }
      }
    };

    const handleMouseDown = (opt: any) => {
      const evt = opt.e as MouseEvent;
      const clickedOnObject = opt.target; // undefined if clicked on empty canvas
      
      // Enable panning if:
      // 1. Pan tool is active, OR
      // 2. Middle mouse button, OR
      // 3. Shift+Drag, OR
      // 4. Space+Drag, OR
      // 5. Left-click on EMPTY canvas space (no object underneath) with select tool - NEW!
      const shouldPan = 
        props.activeTool === "pan" || 
        evt.button === 1 || 
        (evt.shiftKey && evt.button === 0) || 
        (spacePressed && evt.button === 0) ||
        (!clickedOnObject && evt.button === 0 && props.activeTool === "select"); // Smooth pan on empty space
      
      if (shouldPan) {
        isPanningRef.current = true;
        canvas.selection = false; // Disable selection box
        
        // CRITICAL: Disable ALL object interactivity during panning
        // This prevents objects from moving - only the VIEW moves
        canvas.getObjects().forEach((obj: any) => {
          obj.set({ evented: false });
        });
        
        lastPosRef.current = { x: evt.clientX, y: evt.clientY };
        canvas.defaultCursor = "grabbing";
        canvas.requestRenderAll();
      }
    };

    const handleMouseMove = (opt: TEvent) => {
      if (isPanningRef.current) {
        const evt = opt.e as MouseEvent;
        const vpt = canvas.viewportTransform;
        if (vpt) {
          vpt[4] += evt.clientX - lastPosRef.current.x;
          vpt[5] += evt.clientY - lastPosRef.current.y;
          canvas.requestRenderAll();
        }
        lastPosRef.current = { x: evt.clientX, y: evt.clientY };
      }
    };

    const handleMouseUp = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        canvas.defaultCursor = spacePressed ? "grab" : getCursorForTool(props.activeTool);
        
        // Re-enable object interactivity after panning
        canvas.getObjects().forEach((obj: any) => {
          obj.set({ evented: true });
        });
        
        if (props.activeTool === "select") {
          canvas.selection = true;
        }
        canvas.requestRenderAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [props.activeTool]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ignore if typing in text field or editing Fabric text
      const target = e.target as HTMLElement;
      const activeObject = canvas.getActiveObject();
      const isEditingText = activeObject && (activeObject as any).isEditing;
      
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable || isEditingText) {
        return;
      }

      // Ctrl/Cmd+A - Select all
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        const allObjects = canvas.getObjects();
        if (allObjects.length > 0) {
          canvas.discardActiveObject();
          const selection = new (window as any).fabric.ActiveSelection(allObjects, { canvas });
          canvas.setActiveObject(selection);
          canvas.renderAll();
        }
      }

      // Ctrl/Cmd+C - Copy
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        if (activeObject) {
          const cloned = await activeObject.clone();
          (window as any)._clipboardObject = cloned;
        }
      }

      // Ctrl/Cmd+V - Paste
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        const clipboard = (window as any)._clipboardObject;
        if (clipboard) {
          const clonedObj = await clipboard.clone();
          canvas.discardActiveObject();
          clonedObj.set({
            left: (clonedObj.left || 0) + 10,
            top: (clonedObj.top || 0) + 10,
          });
          canvas.add(clonedObj);
          canvas.setActiveObject(clonedObj);
          canvas.requestRenderAll();
        }
      }

      // Ctrl/Cmd+D - Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        if (activeObject) {
          const cloned = await activeObject.clone();
          cloned.set({
            left: (cloned.left || 0) + 10,
            top: (cloned.top || 0) + 10,
          });
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.requestRenderAll();
        }
      }

      // Delete key - Delete selected objects
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
          canvas.remove(...activeObjects);
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };

    // Ctrl+Scroll - Zoom
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Check if editing Fabric text or HTML input
        const target = document.activeElement as HTMLElement;
        const isHTMLInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
        const activeObject = canvas.getActiveObject();
        const isEditingText = activeObject && (activeObject as any).isEditing;
        
        if (isHTMLInput || isEditingText) {
          return;
        }
        
        e.preventDefault();
        const delta = e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        
        // Clamp zoom between 10% and 400%
        zoom = Math.max(0.1, Math.min(4, zoom));
        
        const point = new Point(e.offsetX, e.offsetY);
        canvas.zoomToPoint(point, zoom);
        
        // Update external zoom state
        if (props.onZoomChange) {
          props.onZoomChange(Math.round(zoom * 100));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.getElement().addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.getElement().removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Update drawing mode and tool settings
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    // Configure drawing brush for pen tool
    if (props.activeTool === "pen") {
      canvas.isDrawingMode = true;
      canvas.selection = false;
      
      const brush = new PencilBrush(canvas);
      brush.width = props.penSize;
      
      // Apply opacity
      const opacity = props.penOpacity / 100;
      const color = props.strokeColor;
      const hexOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
      brush.color = color.length === 7 ? color + hexOpacity : color;
      
      // Pen type variations
      switch (props.penType) {
        case "marker":
          brush.width = props.penSize * 1.5;
          break;
        case "highlighter":
          brush.width = props.penSize * 2;
          const highlightOpacity = Math.round(0.4 * 255).toString(16).padStart(2, '0');
          brush.color = color.length === 7 ? color + highlightOpacity : color;
          break;
      }
      
      canvas.freeDrawingBrush = brush;
    } else {
      canvas.isDrawingMode = false;
      // Canva-style: Always allow object selection (except during drawing)
      canvas.selection = true;
    }

    // Update cursor based on tool
    canvas.defaultCursor = getCursorForTool(props.activeTool);
    canvas.hoverCursor = getCursorForTool(props.activeTool);
  }, [props.activeTool, props.strokeColor, props.penSize, props.penOpacity, props.penType]);

  // Canva-style: Make text editable on double-click
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    const handleObjectDoubleClick = (e: any) => {
      const target = e.target;
      if (target && target.type === 'i-text') {
        target.enterEditing();
        target.selectAll();
        canvas.renderAll();
      }
    };
    
    canvas.on('mouse:dblclick', handleObjectDoubleClick);
    
    return () => {
      canvas.off('mouse:dblclick', handleObjectDoubleClick);
    };
  }, []);

  // Handle eraser tool - Eraser using globalCompositeOperation on paths
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    if (props.activeTool === "eraser") {
      // Enable drawing mode for eraser
      canvas.isDrawingMode = true;
      canvas.selection = false;
      
      //Configure pen brush for erasing
      const brush = new PencilBrush(canvas);
      brush.width = props.eraserSize * 2; // Diameter  
      brush.color = "white"; // Will be made transparent
      canvas.freeDrawingBrush = brush;
      
      // Set cursor to none for custom cursor
      canvas.defaultCursor = 'none';
      canvas.hoverCursor = 'none';
      canvas.freeDrawingCursor = 'none';
      
      // When path is created, make it erase pixels
      const handlePathCreated = (e: any) => {
        if (props.activeTool === "eraser" && e.path) {
          // Set eraser compositing mode
          e.path.globalCompositeOperation = 'destination-out';
          e.path.selectable = false;
          e.path.evented = false;
          
          // CRITICAL FIX: Ensure globalCompositeOperation is included in JSON serialization
          // Without this, erased content reappears when canvas state is saved/loaded
          e.path.toObject = (function(toObject: any) {
            return function(this: any) {
              return Object.assign(toObject.call(this), {
                globalCompositeOperation: this.globalCompositeOperation
              });
            };
          })(e.path.toObject);
          
          canvas.renderAll();
        }
      };
      
      canvas.on('path:created', handlePathCreated);
      
      return () => {
        canvas.off('path:created', handlePathCreated);
        canvas.isDrawingMode = false;
        canvas.selection = true;
      };
    } else if (canvas.isDrawingMode && props.activeTool !== "pen") {
      // Disable drawing mode if not pen or eraser
      canvas.isDrawingMode = false;
    }
  }, [props.activeTool, props.eraserSize]);

  // Track mouse position for custom cursor
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    
    setShowCustomCursor(props.activeTool === "eraser");
    
    const handleMouseMove = (e: MouseEvent) => {
      if (props.activeTool === "eraser") {
        setCursorPos({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleMouseEnter = () => {
      if (props.activeTool === "eraser") {
        setShowCustomCursor(true);
      }
    };
    
    const handleMouseLeave = () => {
      setShowCustomCursor(false);
    };
    
    const container = canvasContainerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [props.activeTool, props.eraserSize]);

  // Handle text tool
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;

    // Exit editing mode when switching away from text tool
    if (props.activeTool !== "text") {
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject as any).isEditing) {
        (activeObject as any).exitEditing();
        canvas.renderAll();
      }
      return;
    }

    const handleMouseDown = (e: TEvent) => {
      if (props.activeTool !== "text") return;
      
      // Only create text on left-click (button 0), not right-click (button 2)
      const mouseEvent = e.e as MouseEvent;
      if (mouseEvent.button !== 0) return;
      
      // Canva-style: If clicking on an existing object, select it instead of creating new text
      const target = (e as any).target;
      if (target && target !== canvas) {
        // If clicking on an IText object, enter editing mode
        if ((target as any).type === 'i-text') {
          canvas.setActiveObject(target as FabricObject);
          (target as any).enterEditing();
          (target as any).selectAll();
        } else {
          canvas.setActiveObject(target as FabricObject);
        }
        canvas.renderAll();
        return;
      }
      
      // If clicking outside text, exit editing mode on current text
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject as any).isEditing) {
        (activeObject as any).exitEditing();
      }
      
      const pointer = canvas.getPointer(e.e);
      const text = new IText("Type here...", {
        left: pointer.x,
        top: pointer.y,
        fill: props.textColor,
        fontSize: props.textSize,
        fontFamily: "Arial",
        textAlign: props.textAlign as any,
      });
      
      canvas.add(text);
      canvas.setActiveObject(text);
      text.enterEditing();
      text.selectAll();
      canvas.renderAll();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject as any).isEditing) {
        // Escape key exits editing mode
        if (e.key === 'Escape') {
          (activeObject as any).exitEditing();
          canvas.discardActiveObject();
          canvas.renderAll();
          e.preventDefault();
        }
      }
    };

    canvas.on("mouse:down", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.activeTool, props.textColor, props.textSize, props.textAlign]);

  // Handle shape tools
  useEffect(() => {
    if (!fabricCanvasRef.current || !props.activeTool.startsWith("shape-")) return;
    
    const canvas = fabricCanvasRef.current;
    let shape: FabricObject | null = null;
    let isDown = false;
    let origX = 0;
    let origY = 0;

    const shapeType = props.activeTool.replace("shape-", "");

    const handleMouseDown = (e: TEvent) => {
      // Canva-style: If clicking on an existing object, select it instead of drawing new shape
      const target = (e as any).target;
      if (target && target !== canvas) {
        canvas.setActiveObject(target as FabricObject);
        canvas.renderAll();
        return;
      }
      
      isDown = true;
      const pointer = canvas.getPointer(e.e);
      origX = pointer.x;
      origY = pointer.y;

      const commonProps = {
        left: origX,
        top: origY,
        stroke: props.strokeColor,
        strokeWidth: 2,
        fill: props.fillColor === "#FFFFFF" ? "transparent" : props.fillColor,
      };

      switch (shapeType) {
        case "rectangle":
          shape = new Rect({ ...commonProps, width: 0, height: 0 });
          break;
        case "circle":
          shape = new Circle({ ...commonProps, radius: 0 });
          break;
        case "triangle":
          shape = new Triangle({ ...commonProps, width: 0, height: 0 });
          break;
        case "line":
          shape = new Line([origX, origY, origX, origY], {
            ...commonProps,
            fill: undefined,
          });
          break;
        case "arrow":
          // Create a path for the arrow with line and arrowhead
          const arrowGroup = new Group([], { ...commonProps });
          const arrowLine = new Line([0, 0, 0, 0], {
            stroke: props.strokeColor,
            strokeWidth: 2,
            fill: undefined,
          });
          arrowGroup.add(arrowLine);
          shape = arrowGroup as any;
          (shape as any)._isArrow = true;
          break;
        case "pentagon":
          shape = new Polygon(
            [
              { x: 0, y: -50 },
              { x: 47, y: -15 },
              { x: 29, y: 40 },
              { x: -29, y: 40 },
              { x: -47, y: -15 },
            ],
            { ...commonProps }
          );
          break;
        case "hexagon":
          shape = new Polygon(
            [
              { x: 0, y: -50 },
              { x: 43, y: -25 },
              { x: 43, y: 25 },
              { x: 0, y: 50 },
              { x: -43, y: 25 },
              { x: -43, y: -25 },
            ],
            { ...commonProps }
          );
          break;
        case "star":
          const starPoints = [];
          const outerRadius = 50;
          const innerRadius = 20;
          // Generate 10 points (5 outer + 5 inner) alternating
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            starPoints.push({
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
            });
          }
          shape = new Polygon(starPoints, { ...commonProps });
          break;
        default:
          shape = new Circle({ ...commonProps, radius: 0 });
      }

      if (shape) {
        canvas.add(shape);
      }
    };

    const handleMouseMove = (e: TEvent) => {
      if (!isDown || !shape) return;
      const pointer = canvas.getPointer(e.e);

      if (shape instanceof Rect) {
        const width = Math.abs(origX - pointer.x);
        const height = Math.abs(origY - pointer.y);
        shape.set({
          width,
          height,
          left: Math.min(origX, pointer.x),
          top: Math.min(origY, pointer.y),
        });
      } else if (shape instanceof Circle) {
        const radius = Math.sqrt(
          Math.pow(pointer.x - origX, 2) + Math.pow(pointer.y - origY, 2)
        );
        shape.set({ radius });
      } else if (shape instanceof Triangle) {
        const width = Math.abs(origX - pointer.x);
        const height = Math.abs(origY - pointer.y);
        shape.set({
          width,
          height,
          left: Math.min(origX, pointer.x),
          top: Math.min(origY, pointer.y),
        });
      } else if (shape instanceof Line) {
        shape.set({ x2: pointer.x, y2: pointer.y });
      } else if ((shape as any)._isArrow) {
        // Update arrow line and arrowhead
        const group = shape as Group;
        const objects = group.getObjects();
        const line = objects[0] as Line;
        const dx = pointer.x - origX;
        const dy = pointer.y - origY;
        
        line.set({ x2: dx, y2: dy });
        
        // Remove old arrowhead if exists
        if (objects.length > 1) {
          group.remove(objects[1]);
        }
        
        // Add arrowhead triangle
        const angle = Math.atan2(dy, dx);
        const headlen = 15;
        const arrowHead = new Triangle({
          left: dx,
          top: dy,
          width: headlen,
          height: headlen,
          fill: props.strokeColor,
          angle: (angle * 180) / Math.PI + 90,
          originX: 'center',
          originY: 'center',
        });
        group.add(arrowHead);
      } else if (shape instanceof Polygon) {
        const scaleX = (pointer.x - origX) / 100;
        const scaleY = (pointer.y - origY) / 100;
        shape.set({
          scaleX: Math.max(0.1, Math.abs(scaleX)),
          scaleY: Math.max(0.1, Math.abs(scaleY)),
          left: Math.min(origX, pointer.x),
          top: Math.min(origY, pointer.y),
        });
      }

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      isDown = false;
      shape = null;
      // Trigger shape complete callback to save state for undo/redo
      if (props.onShapeComplete) {
        props.onShapeComplete();
      }
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [props.activeTool, props.strokeColor, props.fillColor]);

  // Context menu handlers
  const handleCopy = async () => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      const cloned = await activeObject.clone();
      (window as any)._clipboardObject = cloned;
    }
  };

  const handlePaste = async () => {
    if (!fabricCanvasRef.current) return;
    const clipboard = (window as any)._clipboardObject;
    if (clipboard) {
      const clonedObj = await clipboard.clone();
      fabricCanvasRef.current!.discardActiveObject();
      clonedObj.set({
        left: (clonedObj.left || 0) + 10,
        top: (clonedObj.top || 0) + 10,
      });
      fabricCanvasRef.current!.add(clonedObj);
      fabricCanvasRef.current!.setActiveObject(clonedObj);
      fabricCanvasRef.current!.requestRenderAll();
    }
  };

  const handleDelete = () => {
    if (!fabricCanvasRef.current) return;
    const activeObjects = fabricCanvasRef.current.getActiveObjects();
    if (activeObjects.length) {
      fabricCanvasRef.current.remove(...activeObjects);
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleDuplicate = async () => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      const cloned = await activeObject.clone();
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
      });
      fabricCanvasRef.current!.add(cloned);
      fabricCanvasRef.current!.setActiveObject(cloned);
      fabricCanvasRef.current!.renderAll();
    }
  };

  const handleBringToFront = () => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.bringObjectToFront(activeObject);
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleSendToBack = () => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.sendObjectToBack(activeObject);
      fabricCanvasRef.current.renderAll();
    }
  };

  // Handle drag-and-drop for images
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/") && fabricCanvasRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        FabricImage.fromURL(imgUrl).then((img) => {
          const canvas = fabricCanvasRef.current!;
          img.scaleToWidth(200);
          
          // Position at drop location
          const canvasOffset = canvas.getElement().getBoundingClientRect();
          const pointer = canvas.getPointer(e as any);
          img.set({
            left: pointer.x - (img.width! * img.scaleX!) / 2,
            top: pointer.y - (img.height! * img.scaleY!) / 2,
          });
          
          canvas.add(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={canvasContainerRef}
          className={`flex-1 overflow-hidden relative bg-white ${isDraggingOver ? "ring-2 ring-blue-500 ring-inset" : ""}`}
          style={{
            backgroundImage: props.showGrid
              ? 'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)'
              : 'none',
            backgroundSize: props.showGrid ? '20px 20px' : 'auto',
            backgroundColor: '#ffffff'
          }}
          data-testid="canvas-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <canvas ref={canvasRef} />
          
          {/* Canvas Code Display */}
          {props.currentCanvasCode && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded border-2 border-red-700 font-mono text-xs tracking-wider z-10 shadow-lg">
              <div className="font-bold">{props.currentCanvasCode}</div>
            </div>
          )}
          
          {isDraggingOver && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center pointer-events-none">
              <div className="text-2xl font-semibold text-blue-600">Drop image here</div>
            </div>
          )}
          {/* Custom eraser cursor - Canva-style visible circle */}
          {showCustomCursor && props.activeTool === "eraser" && (
            <div
              className="fixed pointer-events-none z-50"
              style={{
                left: cursorPos.x,
                top: cursorPos.y,
                transform: 'translate(-50%, -50%)',
              }}
              data-testid="eraser-cursor"
            >
              <div
                className="rounded-full"
                style={{
                  width: `${props.eraserSize * 2}px`,
                  height: `${props.eraserSize * 2}px`,
                  border: '1px solid rgba(0, 0, 0, 0.5)',
                  backgroundColor: 'transparent',
                }}
              />
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent data-testid="context-menu" className="bg-[#252525] border-[#3a3a3a] text-white">
        <ContextMenuItem onClick={handleCopy} data-testid="context-copy" className="text-gray-300 hover:bg-white/10 hover:text-white">
          <Copy className="w-4 h-4 mr-2" />
          Copy
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handlePaste} data-testid="context-paste" className="text-gray-300 hover:bg-white/10 hover:text-white">
          <Clipboard className="w-4 h-4 mr-2" />
          Paste
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDuplicate} data-testid="context-duplicate" className="text-gray-300 hover:bg-white/10 hover:text-white">
          <CopyPlus className="w-4 h-4 mr-2" />
          Duplicate
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+D</span>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-[#2d2d2d]" />
        <ContextMenuItem onClick={handleBringToFront} data-testid="context-bring-front" className="text-gray-300 hover:bg-white/10 hover:text-white">
          <MoveUp className="w-4 h-4 mr-2" />
          Bring to Front
        </ContextMenuItem>
        <ContextMenuItem onClick={handleSendToBack} data-testid="context-send-back" className="text-gray-300 hover:bg-white/10 hover:text-white">
          <MoveDown className="w-4 h-4 mr-2" />
          Send to Back
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-[#2d2d2d]" />
        <ContextMenuItem onClick={() => {
          const activeObject = fabricCanvasRef.current?.getActiveObject();
          if (activeObject) {
            activeObject.set({ lockMovementX: true, lockMovementY: true, lockRotation: true, lockScalingX: true, lockScalingY: true, selectable: false });
            fabricCanvasRef.current?.renderAll();
          }
        }} data-testid="context-lock" className="text-gray-300 hover:bg-white/10 hover:text-white">
          <Lock className="w-4 h-4 mr-2" />
          Lock
        </ContextMenuItem>
        <ContextMenuItem onClick={() => {
          const activeObject = fabricCanvasRef.current?.getActiveObject();
          if (activeObject) {
            activeObject.set({ lockMovementX: false, lockMovementY: false, lockRotation: false, lockScalingX: false, lockScalingY: false, selectable: true });
            fabricCanvasRef.current?.renderAll();
          }
        }} data-testid="context-unlock" className="text-gray-300 hover:bg-white/10 hover:text-white">
          <Unlock className="w-4 h-4 mr-2" />
          Unlock
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-[#2d2d2d]" />
        <ContextMenuItem onClick={handleDelete} className="text-red-400 hover:bg-white/10" data-testid="context-delete">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
          <span className="ml-auto text-xs">Del</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function getCursorForTool(tool: string): string {
  if (tool === "select") return "default";
  if (tool === "pen") return "crosshair";
  if (tool === "text") return "text";
  if (tool === "eraser") return "cell";
  if (tool === "pan") return "grab";
  if (tool.startsWith("shape-")) return "crosshair";
  return "default";
}
