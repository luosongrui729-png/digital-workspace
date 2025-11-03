import { ToolButton } from "./ToolButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MousePointer2,
  Hand,
  Pen,
  Star,
  Smile,
  Type,
  Paintbrush,
  Plus,
  Square,
  FileText,
  Settings,
  HelpCircle,
  Eraser,
} from "lucide-react";

interface LeftToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export function LeftToolbar({ activeTool, onToolChange }: LeftToolbarProps) {
  return (
    <div
      className="w-12 bg-[#2C2D30] border-r border-[#3E3F42] flex flex-col items-center py-2 gap-1"
      data-testid="toolbar-left"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToolChange("select")}
        className={`w-10 h-10 text-white hover:bg-white/10 ${
          activeTool === "select" ? "bg-white/20" : ""
        }`}
        data-testid="button-tool-select"
      >
        <MousePointer2 className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToolChange("pan")}
        className={`w-10 h-10 text-white hover:bg-white/10 ${
          activeTool === "pan" ? "bg-white/20" : ""
        }`}
        data-testid="button-tool-pan"
      >
        <Hand className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToolChange("pen")}
        className={`w-10 h-10 text-white hover:bg-white/10 ${
          activeTool === "pen" ? "bg-white/20" : ""
        }`}
        data-testid="button-tool-pen"
      >
        <Pen className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToolChange("shapes")}
        className={`w-10 h-10 text-white hover:bg-white/10 ${
          activeTool === "shapes" ? "bg-white/20" : ""
        }`}
        data-testid="button-tool-star"
      >
        <Star className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToolChange("emoji")}
        className={`w-10 h-10 text-white hover:bg-white/10 ${
          activeTool === "emoji" ? "bg-white/20" : ""
        }`}
        data-testid="button-tool-emoji"
      >
        <Smile className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToolChange("text")}
        className={`w-10 h-10 text-white hover:bg-white/10 ${
          activeTool === "text" ? "bg-yellow-500/90" : ""
        }`}
        data-testid="button-tool-text"
      >
        <Type className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToolChange("brush")}
        className={`w-10 h-10 text-white hover:bg-white/10 ${
          activeTool === "brush" ? "bg-white/20" : ""
        }`}
        data-testid="button-tool-brush"
      >
        <Paintbrush className="w-5 h-5" />
      </Button>

      <Separator className="w-8 my-2 bg-[#3E3F42]" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToolChange("add")}
        className="w-10 h-10 text-white hover:bg-white/10"
        data-testid="button-tool-add"
      >
        <Plus className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToolChange("eraser")}
        className={`w-10 h-10 text-white hover:bg-white/10 ${
          activeTool === "eraser" ? "bg-white/20" : ""
        }`}
        data-testid="button-tool-eraser"
      >
        <Square className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToolChange("document")}
        className="w-10 h-10 text-white hover:bg-white/10"
        data-testid="button-tool-document"
      >
        <FileText className="w-5 h-5" />
      </Button>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => console.log("Settings")}
        className="w-10 h-10 text-white hover:bg-white/10"
        data-testid="button-settings"
      >
        <Settings className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => console.log("Help")}
        className="w-10 h-10 text-white hover:bg-white/10"
        data-testid="button-help"
      >
        <HelpCircle className="w-5 h-5" />
      </Button>
    </div>
  );
}
