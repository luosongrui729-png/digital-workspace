import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Plus, Palette } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#000000", "#FFFFFF", "#FF0000", "#FF6900", "#FFB800",
  "#FFD700", "#00FF00", "#00BFFF", "#007BFF", "#5856D6",
  "#AF52DE", "#FF2D92", "#FF4081", "#8B4513", "#A0522D",
  "#808080", "#C0C0C0", "#D3D3D3", "#F5F5F5", "#2ECC71",
  "#E74C3C", "#3498DB", "#9B59B6", "#1ABC9C", "#F39C12",
];

interface UnifiedColorPickerProps {
  strokeColor: string;
  fillColor: string;
  textColor: string;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  trigger?: React.ReactNode;
}

export function UnifiedColorPicker(props: UnifiedColorPickerProps) {
  const [activeTab, setActiveTab] = useState<"stroke" | "fill" | "text">("stroke");
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [hexInput, setHexInput] = useState("");
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 });

  // Load custom colors from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("whiteboard_custom_colors");
    if (saved) {
      try {
        setCustomColors(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load custom colors", e);
      }
    }
  }, []);

  // Get current color based on active tab
  const getCurrentColor = () => {
    switch (activeTab) {
      case "stroke":
        return props.strokeColor;
      case "fill":
        return props.fillColor;
      case "text":
        return props.textColor;
      default:
        return "#000000";
    }
  };

  // Set color based on active tab
  const setCurrentColor = (color: string) => {
    switch (activeTab) {
      case "stroke":
        props.onStrokeColorChange(color);
        break;
      case "fill":
        props.onFillColorChange(color);
        break;
      case "text":
        props.onTextColorChange(color);
        break;
    }
  };

  // Update hex input and RGB values when current color changes
  useEffect(() => {
    const currentColor = getCurrentColor();
    setHexInput(currentColor);
    
    const rgb = hexToRgb(currentColor);
    if (rgb) {
      setRgbValues(rgb);
    }
  }, [activeTab, props.strokeColor, props.fillColor, props.textColor]);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const handleHexChange = (value: string) => {
    let formatted = value.toUpperCase();
    if (!formatted.startsWith("#")) {
      formatted = "#" + formatted;
    }
    setHexInput(formatted);
    
    if (/^#[0-9A-F]{6}$/i.test(formatted)) {
      setCurrentColor(formatted);
      const rgb = hexToRgb(formatted);
      if (rgb) {
        setRgbValues(rgb);
      }
    }
  };

  const handleRgbChange = (channel: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgbValues, [channel]: value };
    setRgbValues(newRgb);
    
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHexInput(hex);
    setCurrentColor(hex);
  };

  const handleAddCustomColor = () => {
    const currentColor = getCurrentColor();
    if (!customColors.includes(currentColor) && customColors.length < 12) {
      const updated = [...customColors, currentColor];
      setCustomColors(updated);
      localStorage.setItem("whiteboard_custom_colors", JSON.stringify(updated));
    }
  };

  const currentColor = getCurrentColor();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {props.trigger || (
          <Button
            variant="outline"
            className="h-11 gap-2 hover-elevate text-gray-300 hover:text-white border-[#3a3a3a] hover:bg-white/5"
            data-testid="button-unified-color"
          >
            <Palette className="w-4 h-4" />
            <span className="text-xs font-medium">Colors</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 bg-[#252525] border-[#3a3a3a] shadow-2xl p-4 space-y-4"
        side="right"
        data-testid="popover-unified-color"
      >
        {/* Tabs for Stroke/Fill/Text */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-[#1e1e1e]">
            <TabsTrigger 
              value="stroke" 
              className="data-[state=active]:bg-white/10 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-xs text-gray-300"
              data-testid="tab-stroke"
            >
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: props.strokeColor }}
                />
                Stroke
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="fill" 
              className="data-[state=active]:bg-white/10 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-xs text-gray-300"
              data-testid="tab-fill"
            >
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-3 h-3 rounded border border-white/30"
                  style={{ backgroundColor: props.fillColor }}
                />
                Fill
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="text" 
              className="data-[state=active]:bg-white/10 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-xs text-gray-300"
              data-testid="tab-text"
            >
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-3 h-3 rounded border border-white/30"
                  style={{ backgroundColor: props.textColor }}
                />
                Text
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Preset Color Palette */}
        <div>
          <Label className="text-xs text-gray-400 mb-2 block">Preset Colors</Label>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-11 h-11 rounded-md border-2 transition-all hover:scale-110 hover:shadow-lg relative",
                  currentColor.toUpperCase() === color.toUpperCase()
                    ? "border-white ring-2 ring-blue-500"
                    : "border-[#3a3a3a]"
                )}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
                data-testid={`color-preset-${color}`}
              >
                {currentColor.toUpperCase() === color.toUpperCase() && (
                  <Check className="w-5 h-5 text-white absolute inset-0 m-auto drop-shadow-lg" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Input */}
        <div className="space-y-3">
          <Label className="text-xs text-gray-400">Custom Color</Label>
          
          {/* HEX Input with Live Preview */}
          <div className="flex gap-2 items-center">
            <Input
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 bg-[#1e1e1e] border-[#3a3a3a] text-white font-mono text-sm"
              maxLength={7}
              data-testid="input-hex-unified"
            />
            <div
              className="w-12 h-10 rounded border-2 border-[#3a3a3a]"
              style={{ backgroundColor: currentColor }}
            />
          </div>

          {/* RGB Sliders */}
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-red-400 font-medium">R</span>
                <span className="text-gray-400">{rgbValues.r}</span>
              </div>
              <Slider
                value={[rgbValues.r]}
                onValueChange={([value]) => handleRgbChange("r", value)}
                min={0}
                max={255}
                step={1}
                data-testid="slider-r-unified"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-green-400 font-medium">G</span>
                <span className="text-gray-400">{rgbValues.g}</span>
              </div>
              <Slider
                value={[rgbValues.g]}
                onValueChange={([value]) => handleRgbChange("g", value)}
                min={0}
                max={255}
                step={1}
                data-testid="slider-g-unified"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-blue-400 font-medium">B</span>
                <span className="text-gray-400">{rgbValues.b}</span>
              </div>
              <Slider
                value={[rgbValues.b]}
                onValueChange={([value]) => handleRgbChange("b", value)}
                min={0}
                max={255}
                step={1}
                data-testid="slider-b-unified"
              />
            </div>
          </div>

          {/* Add to Custom Button */}
          <Button
            onClick={handleAddCustomColor}
            variant="outline"
            size="sm"
            className="w-full bg-[#1e1e1e] border-[#3a3a3a] text-gray-300 hover:bg-white/5 hover:text-white"
            disabled={customColors.length >= 12}
            data-testid="button-add-custom-unified"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add to Custom {customColors.length > 0 && `(${customColors.length}/12)`}
          </Button>
        </div>

        {/* Custom Saved Colors */}
        {customColors.length > 0 && (
          <div>
            <Label className="text-xs text-gray-400 mb-2 block">Saved Custom Colors</Label>
            <div className="grid grid-cols-6 gap-2">
              {customColors.map((color, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-11 h-11 rounded-md border-2 transition-all hover:scale-110 hover:shadow-lg relative",
                    currentColor.toUpperCase() === color.toUpperCase()
                      ? "border-white ring-2 ring-blue-500"
                      : "border-[#3a3a3a]"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                  data-testid={`color-custom-${index}`}
                >
                  {currentColor.toUpperCase() === color.toUpperCase() && (
                    <Check className="w-5 h-5 text-white absolute inset-0 m-auto drop-shadow-lg" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
