import { useState } from "react";
import { ToolButton } from "./ToolButton";
import { ColorPicker } from "./ColorPicker";
import { CanvasSelector } from "./CanvasSelector";
import { UserPresence } from "./UserPresence";
import { ExportDialog } from "./ExportDialog";
import { CodeEntryDialog } from "./CodeEntryDialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Pen,
  Eraser,
  Type,
  Shapes,
  Image as ImageIcon,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  strokeColor: string;
  fillColor: string;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canvases: any[];
  currentCanvasId: string;
  onCanvasSelect: (id: string) => void;
  onCanvasCreate: () => void;
  onCanvasRename: (id: string, name: string) => void;
  onCanvasDelete: (id: string) => void;
  users: any[];
  isConnected: boolean;
  onExport: (format: string, options: any) => void;
  onJoinCanvas: (code: string) => void;
  currentCanvasCode?: string;
  onImageInsert: () => void;
}

export function Toolbar({
  activeTool,
  onToolChange,
  strokeColor,
  fillColor,
  onStrokeColorChange,
  onFillColorChange,
  zoom,
  onZoomChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  canvases,
  currentCanvasId,
  onCanvasSelect,
  onCanvasCreate,
  onCanvasRename,
  onCanvasDelete,
  users,
  isConnected,
  onExport,
  onJoinCanvas,
  currentCanvasCode,
  onImageInsert,
}: ToolbarProps) {
  return (
    <div
      className="h-14 border-b bg-background px-4 flex items-center gap-2 flex-wrap"
      data-testid="toolbar-main"
    >
      <CanvasSelector
        canvases={canvases}
        currentCanvasId={currentCanvasId}
        onCanvasSelect={onCanvasSelect}
        onCanvasCreate={onCanvasCreate}
        onCanvasRename={onCanvasRename}
        onCanvasDelete={onCanvasDelete}
      />

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1">
        <ToolButton
          icon={<Pen className="w-5 h-5" />}
          label="Pen Tool"
          shortcut="P"
          isActive={activeTool === "pen"}
          onClick={() => onToolChange("pen")}
        />
        <ToolButton
          icon={<Eraser className="w-5 h-5" />}
          label="Eraser Tool"
          shortcut="E"
          isActive={activeTool === "eraser"}
          onClick={() => onToolChange("eraser")}
        />
        <ToolButton
          icon={<Type className="w-5 h-5" />}
          label="Text Tool"
          shortcut="T"
          isActive={activeTool === "text"}
          onClick={() => onToolChange("text")}
        />
        <ToolButton
          icon={<Shapes className="w-5 h-5" />}
          label="Shapes Tool"
          shortcut="S"
          isActive={activeTool === "shapes"}
          onClick={() => onToolChange("shapes")}
        />
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-2">
        <ColorPicker
          label="Stroke"
          value={strokeColor}
          onChange={onStrokeColorChange}
          type="stroke"
        />
        <ColorPicker
          label="Fill"
          value={fillColor}
          onChange={onFillColorChange}
          type="fill"
        />
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs hover-elevate"
          data-testid="button-zoom-display"
        >
          {zoom}%
        </Button>
        <ToolButton
          icon={<ZoomOut className="w-5 h-5" />}
          label="Zoom Out"
          shortcut="Ctrl+-"
          onClick={() => onZoomChange(Math.max(10, zoom - 10))}
          disabled={zoom <= 10}
        />
        <ToolButton
          icon={<ZoomIn className="w-5 h-5" />}
          label="Zoom In"
          shortcut="Ctrl++"
          onClick={() => onZoomChange(Math.min(400, zoom + 10))}
          disabled={zoom >= 400}
        />
        <ToolButton
          icon={<Maximize2 className="w-5 h-5" />}
          label="Reset Zoom"
          shortcut="Ctrl+0"
          onClick={() => onZoomChange(100)}
        />
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1">
        <ToolButton
          icon={<Undo2 className="w-5 h-5" />}
          label="Undo"
          shortcut="Ctrl+Z"
          onClick={onUndo}
          disabled={!canUndo}
        />
        <ToolButton
          icon={<Redo2 className="w-5 h-5" />}
          label="Redo"
          shortcut="Ctrl+Y"
          onClick={onRedo}
          disabled={!canRedo}
        />
      </div>

      <Separator orientation="vertical" className="h-8" />

      <ToolButton
        icon={<ImageIcon className="w-5 h-5" />}
        label="Insert Image"
        onClick={onImageInsert}
      />

      <ExportDialog onExport={onExport} />

      <CodeEntryDialog
        currentCanvasCode={currentCanvasCode}
        onJoinCanvas={onJoinCanvas}
      />

      <div className="flex-1" />

      <UserPresence users={users} isConnected={isConnected} />
    </div>
  );
}
