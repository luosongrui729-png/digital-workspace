import { useRef, useEffect, useState } from "react";
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

interface CanvasProps {
  activeTool: string;
  strokeColor: string;
  fillColor: string;
  zoom: number;
  showGrid: boolean;
}

export function Canvas({
  activeTool,
  strokeColor,
  fillColor,
  zoom,
  showGrid,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && (e.metaKey || e.ctrlKey || e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isPanning) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPanning]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={canvasRef}
          className="flex-1 overflow-hidden relative bg-background"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: isPanning ? "grabbing" : activeTool === "pen" ? "crosshair" : "default",
          }}
          data-testid="canvas-main"
        >
          <div
            className="w-full h-full"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
              transformOrigin: "0 0",
              backgroundImage: showGrid
                ? `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`
                : "none",
              backgroundSize: showGrid ? "20px 20px" : "auto",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Canvas Area</p>
                <p className="text-xs mt-2">
                  Active Tool: <span className="font-semibold capitalize">{activeTool}</span>
                </p>
                <p className="text-xs">Zoom: {zoom}%</p>
                <p className="text-xs mt-4 max-w-md">
                  In the full app, this will be an infinite canvas powered by Fabric.js
                  with support for drawing, shapes, text, and real-time collaboration.
                </p>
                <p className="text-xs mt-2 text-muted-foreground/60">
                  Try: Right-click for context menu • Space+Drag to pan
                </p>
              </div>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent data-testid="context-menu">
        <ContextMenuItem data-testid="context-copy">
          <Copy className="w-4 h-4 mr-2" />
          Copy
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
        </ContextMenuItem>
        <ContextMenuItem data-testid="context-paste">
          <Clipboard className="w-4 h-4 mr-2" />
          Paste
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
        </ContextMenuItem>
        <ContextMenuItem data-testid="context-duplicate">
          <CopyPlus className="w-4 h-4 mr-2" />
          Duplicate
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+D</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem data-testid="context-bring-front">
          <MoveUp className="w-4 h-4 mr-2" />
          Bring to Front
        </ContextMenuItem>
        <ContextMenuItem data-testid="context-send-back">
          <MoveDown className="w-4 h-4 mr-2" />
          Send to Back
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem data-testid="context-lock">
          <Lock className="w-4 h-4 mr-2" />
          Lock
        </ContextMenuItem>
        <ContextMenuItem data-testid="context-unlock">
          <Unlock className="w-4 h-4 mr-2" />
          Unlock
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive" data-testid="context-delete">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
          <span className="ml-auto text-xs">Del</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
