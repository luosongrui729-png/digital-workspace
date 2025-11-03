import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Plus, FileText, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Canvas {
  id: string;
  name: string;
  code: string;
  thumbnail?: string;
  createdAt: Date;
  modifiedAt: Date;
}

interface CanvasSelectorProps {
  canvases: Canvas[];
  currentCanvasId: string;
  onCanvasSelect: (canvasId: string) => void;
  onCanvasCreate: () => void;
  onCanvasRename: (canvasId: string, newName: string) => void;
  onCanvasDelete: (canvasId: string) => void;
}

export function CanvasSelector({
  canvases,
  currentCanvasId,
  onCanvasSelect,
  onCanvasCreate,
  onCanvasRename,
  onCanvasDelete,
}: CanvasSelectorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const currentCanvas = canvases.find((c) => c.id === currentCanvasId);

  const handleRename = (canvasId: string) => {
    if (editName.trim()) {
      onCanvasRename(canvasId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 hover-elevate"
          data-testid="button-canvas-selector"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium max-w-32 truncate">
            {currentCanvas?.name || "Untitled Canvas"}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80" data-testid="dropdown-canvas-menu">
        <div className="p-2">
          <Button
            onClick={onCanvasCreate}
            className="w-full gap-2"
            data-testid="button-create-canvas"
          >
            <Plus className="w-4 h-4" />
            Create New Canvas
          </Button>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 p-3">
            {canvases.map((canvas) => (
              <div
                key={canvas.id}
                className={cn(
                  "relative group cursor-pointer rounded-lg border-2 transition-colors",
                  canvas.id === currentCanvasId
                    ? "border-primary bg-accent"
                    : "border-border hover-elevate"
                )}
                onClick={() => onCanvasSelect(canvas.id)}
                data-testid={`canvas-card-${canvas.id}`}
              >
                <div className="aspect-[4/3] bg-muted rounded-t-md flex items-center justify-center">
                  {canvas.thumbnail ? (
                    <img
                      src={canvas.thumbnail}
                      alt={canvas.name}
                      className="w-full h-full object-cover rounded-t-md"
                    />
                  ) : (
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="p-2 space-y-1">
                  {editingId === canvas.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleRename(canvas.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(canvas.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      className="h-7 text-xs"
                      data-testid={`input-rename-canvas-${canvas.id}`}
                    />
                  ) : (
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-medium truncate flex-1">
                        {canvas.name}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(canvas.id);
                            setEditName(canvas.name);
                          }}
                          data-testid={`button-rename-canvas-${canvas.id}`}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCanvasDelete(canvas.id);
                          }}
                          data-testid={`button-delete-canvas-${canvas.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground font-mono">
                    {canvas.code}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(canvas.modifiedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
