import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MousePointer2,
  Pen,
  Eraser,
  Type,
  Square,
  Circle,
  Triangle,
  Minus,
  MoveRight,
  Pentagon,
  Hexagon,
  Star,
  Image as ImageIcon,
  Grid3x3,
  Hand,
  FileText,
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UnifiedColorPicker } from "./ColorPicker";

const SHAPES = [
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "triangle", label: "Triangle", icon: Triangle },
  { id: "line", label: "Line", icon: Minus },
  { id: "arrow", label: "Arrow", icon: MoveRight },
  { id: "pentagon", label: "Pentagon", icon: Pentagon },
  { id: "hexagon", label: "Hexagon", icon: Hexagon },
  { id: "star", label: "Star", icon: Star },
];

const ERASER_SIZES = [
  { label: "Small", value: 7.5 },   // 15px diameter
  { label: "Medium", value: 15 },   // 30px diameter
  { label: "Large", value: 30 },    // 60px diameter
];

const TEXT_SIZES = [12, 16, 24, 36, 48];

interface LeftSidebarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  strokeColor: string;
  fillColor: string;
  textColor: string;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  penSize: number;
  onPenSizeChange: (size: number) => void;
  penOpacity: number;
  onPenOpacityChange: (opacity: number) => void;
  penType: string;
  onPenTypeChange: (type: string) => void;
  eraserSize: number;
  onEraserSizeChange: (size: number) => void;
  textSize: number;
  onTextSizeChange: (size: number) => void;
  textAlign: string;
  onTextAlignChange: (align: string) => void;
  onImageInsert: () => void;
  showGrid: boolean;
  onGridToggle: () => void;
  canvases: any[];
  currentCanvasId: string;
  onCanvasSelect: (id: string) => void;
  onCanvasCreate: () => void;
  onCanvasRename: (id: string, name: string) => void;
  onCanvasDelete: (id: string) => void;
}

export function LeftSidebar(props: LeftSidebarProps) {
  const currentCanvas = props.canvases.find(c => c.id === props.currentCanvasId);

  const handleToolbarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking directly on the toolbar background (not on any button)
    if (e.target === e.currentTarget) {
      props.onToolChange("select");
    }
  };

  return (
    <div 
      className="w-14 bg-[#1e1e1e] border-r border-[#2d2d2d] flex flex-col items-center py-2 gap-0.5" 
      data-testid="sidebar-left"
      onClick={handleToolbarClick}
    >
      {/* Canvas Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            data-testid="button-canvas-menu"
            title="Canvas history"
          >
            <FileText className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-96 bg-[#252525] border-[#3a3a3a] shadow-2xl">
          <div className="p-2">
            <Button onClick={props.onCanvasCreate} className="w-full gap-2" size="sm" data-testid="button-create-canvas">
              <Plus className="w-4 h-4" />
              Create New Canvas
            </Button>
          </div>
          <DropdownMenuSeparator className="bg-[#2d2d2d]" />
          <div className="max-h-96 overflow-y-auto p-2 space-y-2">
            {props.canvases.map((canvas) => (
              <div
                key={canvas.id}
                className={cn(
                  "p-2 rounded cursor-pointer group hover:bg-white/5",
                  canvas.id === props.currentCanvasId && "bg-white/10"
                )}
                onClick={() => props.onCanvasSelect(canvas.id)}
                data-testid={`canvas-item-${canvas.id}`}
              >
                <div className="flex gap-2">
                  {/* Thumbnail */}
                  <div className="w-20 h-16 flex-shrink-0 bg-[#1e1e1e] rounded border border-[#3a3a3a] overflow-hidden">
                    {canvas.thumbnail ? (
                      <img 
                        src={canvas.thumbnail} 
                        alt={canvas.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* Canvas Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{canvas.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">Code: {canvas.code}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Created {new Date(canvas.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Modified {new Date(canvas.modifiedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newName = prompt("Enter new name:", canvas.name);
                        if (newName) props.onCanvasRename(canvas.id, newName);
                      }}
                      data-testid={`button-rename-${canvas.id}`}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${canvas.name}"?`)) {
                          props.onCanvasDelete(canvas.id);
                        }
                      }}
                      data-testid={`button-delete-${canvas.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* New Page Button */}
      <ToolIconButton
        icon={<Plus className="w-5 h-5" />}
        label="New Page"
        shortcut="Ctrl+N"
        isActive={false}
        onClick={props.onCanvasCreate}
      />

      <Separator className="w-8 my-1.5 bg-[#2d2d2d]" />

      {/* Selection Tool */}
      <ToolIconButton
        icon={<MousePointer2 className="w-5 h-5" />}
        label="Select"
        shortcut="V"
        isActive={props.activeTool === "select"}
        onClick={() => props.onToolChange("select")}
      />

      {/* Hand/Pan Tool */}
      <ToolIconButton
        icon={<Hand className="w-5 h-5" />}
        label="Pan"
        shortcut="Space"
        isActive={props.activeTool === "pan"}
        onClick={() => props.onToolChange("pan")}
      />

      <Separator className="w-8 my-1.5 bg-[#2d2d2d]" />

      {/* Pen Tool with Options */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => props.onToolChange("pen")}
            className={cn(
              "w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white transition-colors",
              props.activeTool === "pen" && "bg-white/10 text-white"
            )}
            data-testid="button-tool-pen-tool"
            title="Pen (P)"
          >
            <Pen className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-72 bg-[#252525] border-[#3a3a3a] shadow-2xl">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-white/90">Pen Options</h4>
            
            <div className="space-y-2">
              <Label className="text-xs text-gray-400 font-medium">Brush Size</Label>
              <Slider
                value={[props.penSize]}
                onValueChange={([size]) => props.onPenSizeChange(size)}
                min={2}
                max={20}
                step={1}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Small (2px)</span>
                <span>{props.penSize}px</span>
                <span>XL (20px)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-400 font-medium">Opacity</Label>
              <Slider
                value={[props.penOpacity]}
                onValueChange={([opacity]) => props.onPenOpacityChange(opacity)}
                min={0}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0%</span>
                <span>{props.penOpacity}%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-400 font-medium">Pen Type</Label>
              <div className="grid grid-cols-3 gap-1">
                {["standard", "marker", "highlighter"].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => props.onPenTypeChange(type)}
                    className={cn(
                      "text-xs capitalize text-gray-300 border-[#3a3a3a] hover:bg-white/5",
                      props.penType === type && "bg-white/10 text-white"
                    )}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Eraser Tool with Options */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => props.onToolChange("eraser")}
            className={cn(
              "w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white transition-colors",
              props.activeTool === "eraser" && "bg-white/10 text-white"
            )}
            data-testid="button-tool-eraser"
            title="Eraser (E)"
          >
            <Eraser className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-56 bg-[#2C2D30] border-[#3E3F42]">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-white">Eraser Size</h4>
            {ERASER_SIZES.map((size) => (
              <Button
                key={size.value}
                variant="outline"
                className={cn(
                  "w-full justify-start text-white border-[#3E3F42] hover:bg-white/10",
                  props.eraserSize === size.value && "bg-white/20"
                )}
                onClick={() => props.onEraserSizeChange(size.value)}
                data-testid={`eraser-size-${size.label.toLowerCase()}`}
              >
                {size.label} ({size.value * 2}px)
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Text Tool with Options */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => props.onToolChange("text")}
            className={cn(
              "w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white transition-colors",
              props.activeTool === "text" && "bg-white/10 text-white"
            )}
            data-testid="button-tool-text"
            title="Text (T)"
          >
            <Type className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-64 bg-[#2C2D30] border-[#3E3F42]">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-white">Text Options</h4>
            
            <div className="space-y-2">
              <Label className="text-xs text-gray-400 font-medium">Font Size</Label>
              <div className="grid grid-cols-5 gap-1">
                {TEXT_SIZES.map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    size="sm"
                    onClick={() => props.onTextSizeChange(size)}
                    className={cn(
                      "text-xs text-white border-[#3E3F42] hover:bg-white/10",
                      props.textSize === size && "bg-white/20"
                    )}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-400 font-medium">Alignment</Label>
              <div className="grid grid-cols-3 gap-1">
                {["left", "center", "right"].map((align) => (
                  <Button
                    key={align}
                    variant="outline"
                    size="sm"
                    onClick={() => props.onTextAlignChange(align)}
                    className={cn(
                      "text-xs capitalize text-white border-[#3E3F42] hover:bg-white/10",
                      props.textAlign === align && "bg-white/20"
                    )}
                  >
                    {align}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Shapes Tool */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <ToolIconButton
              icon={<Square className="w-5 h-5" />}
              label="Shapes"
              shortcut="S"
              isActive={props.activeTool.startsWith("shape-")}
              onClick={() => {}}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-48 bg-[#252525] border-[#3a3a3a] shadow-2xl">
          {SHAPES.map((shape) => (
            <DropdownMenuItem
              key={shape.id}
              onClick={() => props.onToolChange(`shape-${shape.id}`)}
              className="text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer"
            >
              <shape.icon className="w-4 h-4 mr-2" />
              {shape.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator className="w-8 my-1.5 bg-[#2d2d2d]" />

      {/* Unified Color Picker */}
      <ColorPickerButton
        strokeColor={props.strokeColor}
        fillColor={props.fillColor}
        textColor={props.textColor}
        onStrokeColorChange={props.onStrokeColorChange}
        onFillColorChange={props.onFillColorChange}
        onTextColorChange={props.onTextColorChange}
      />

      <Separator className="w-8 my-1.5 bg-[#2d2d2d]" />

      {/* Insert Image */}
      <ToolIconButton
        icon={<ImageIcon className="w-5 h-5" />}
        label="Insert Image"
        shortcut="I"
        isActive={false}
        onClick={props.onImageInsert}
      />

      {/* Grid Toggle */}
      <ToolIconButton
        icon={<Grid3x3 className="w-5 h-5" />}
        label="Toggle Grid"
        shortcut="G"
        isActive={props.showGrid}
        onClick={props.onGridToggle}
      />
    </div>
  );
}

const ToolIconButton = ({ icon, label, shortcut, isActive, onClick, noTooltip }: any) => {
  // Temporarily removing Tooltips to fix React ref conflicts
  // This ensures smooth functionality while we focus on panning feature
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white transition-colors",
        isActive && "bg-white/10 text-white"
      )}
      data-testid={`button-tool-${label.toLowerCase().replace(/\s+/g, '-')}`}
      title={`${label}${shortcut ? ` (${shortcut})` : ''}`} // HTML title attribute for hover text
    >
      {icon}
    </Button>
  );
};

function ColorPickerButton(props: {
  strokeColor: string;
  fillColor: string;
  textColor: string;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
}) {
  return (
    <UnifiedColorPicker
      {...props}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="w-11 h-11 hover:bg-white/5"
          data-testid="button-unified-color"
          title="Color Picker (C)"
        >
          <Palette className="w-5 h-5 text-gray-400" />
        </Button>
      }
    />
  );
}
