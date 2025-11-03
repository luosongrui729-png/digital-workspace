import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  Users,
} from "lucide-react";

interface RightToolbarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  userCount?: number;
}

export function RightToolbar({
  zoom,
  onZoomChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  userCount = 1,
}: RightToolbarProps) {
  return (
    <div
      className="w-12 bg-[#2C2D30] border-l border-[#3E3F42] flex flex-col items-center py-2 gap-1"
      data-testid="toolbar-right"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => console.log("Search")}
        className="w-10 h-10 text-white hover:bg-white/10"
        data-testid="button-search"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onZoomIn()}
        className="w-10 h-10 text-white hover:bg-white/10"
        data-testid="button-zoom-in"
      >
        <ZoomIn className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onZoomOut()}
        className="w-10 h-10 text-white hover:bg-white/10"
        data-testid="button-zoom-out"
      >
        <ZoomOut className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onZoomChange(100)}
        className="w-10 h-10 text-white hover:bg-white/10"
        data-testid="button-zoom-reset"
      >
        <Maximize2 className="w-5 h-5" />
      </Button>

      <Separator className="w-8 my-2 bg-[#3E3F42]" />

      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        className="w-10 h-10 text-white hover:bg-white/10 disabled:opacity-30"
        data-testid="button-undo"
      >
        <Undo2 className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
        className="w-10 h-10 text-white hover:bg-white/10 disabled:opacity-30"
        data-testid="button-redo"
      >
        <Redo2 className="w-5 h-5" />
      </Button>

      <div className="flex-1" />

      {userCount > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 text-white hover:bg-white/10 relative"
          data-testid="button-users"
        >
          <Users className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center">
            {userCount}
          </span>
        </Button>
      )}
    </div>
  );

  function onZoomIn() {
    onZoomChange(Math.min(400, zoom + 10));
  }

  function onZoomOut() {
    onZoomChange(Math.max(10, zoom - 10));
  }
}
