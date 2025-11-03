import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  Download,
  Share2,
  Users,
  Wifi,
  WifiOff,
  MousePointer2,
  Hand,
  Eraser,
  Pen,
  Type,
  Square,
  Circle,
  Image as ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { User } from "@/hooks/useCollaboration";

interface RightSidebarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: (format: string, options: any) => void;
  onShare: (code?: string) => void;
  isConnected: boolean;
  userCount: number;
  users?: User[];
  currentUserId?: string | null;
  currentUserName?: string | null;
  currentUserColor?: string | null;
  currentCanvasCode?: string;
  activeTool?: string;
}

export function RightSidebar(props: RightSidebarProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [exportFormat, setExportFormat] = useState<"png" | "pdf">("png");
  const [exportArea, setExportArea] = useState<"visible" | "full">("visible");
  const [exportResolution, setExportResolution] = useState<"1x" | "2x" | "4x">("1x");
  const [exportBg, setExportBg] = useState<"white" | "transparent">("white");

  // Calculate display count (including dummy users for demo)
  const displayUserCount = (() => {
    const realUserCount = props.userCount;
    const otherUsersCount = props.users?.length || 0;
    // If no other real users, add 3 dummy users for demo
    if (otherUsersCount === 0) {
      return realUserCount + 3; // Current user + 3 dummy users = 4 total
    }
    return realUserCount;
  })();

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case "select": return <MousePointer2 className="w-3 h-3" />;
      case "pan": return <Hand className="w-3 h-3" />;
      case "eraser": return <Eraser className="w-3 h-3" />;
      case "pen": return <Pen className="w-3 h-3" />;
      case "text": return <Type className="w-3 h-3" />;
      case "rectangle": return <Square className="w-3 h-3" />;
      case "circle": return <Circle className="w-3 h-3" />;
      case "image": return <ImageIcon className="w-3 h-3" />;
      default: return <MousePointer2 className="w-3 h-3" />;
    }
  };

  const getToolName = (tool: string) => {
    switch (tool) {
      case "select": return "Select";
      case "pan": return "Pan";
      case "eraser": return "Eraser";
      case "pen": return "Pen";
      case "text": return "Text";
      case "rectangle": return "Rectangle";
      case "circle": return "Circle";
      case "image": return "Image";
      default: return tool;
    }
  };

  const handleExport = () => {
    props.onExport(exportFormat, {
      area: exportArea,
      resolution: exportResolution,
      background: exportBg,
    });
    setExportOpen(false);
  };

  const handleJoinCanvas = () => {
    if (joinCode.length >= 6) {
      props.onShare(joinCode);
      setShareOpen(false);
      setJoinCode("");
    }
  };

  const handleToolbarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking directly on the toolbar background (not on any button)
    // This feature is not applicable to right sidebar as it doesn't have tool selection
  };

  return (
    <div className="w-14 bg-[#1e1e1e] border-l border-[#2d2d2d] flex flex-col items-center py-2 gap-0.5" data-testid="sidebar-right">
      {/* Zoom Display */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-11 h-11 flex items-center justify-center">
            <span className="text-xs text-gray-300 font-mono font-medium">
              {props.zoom}%
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-[#252525] border-[#3a3a3a]">
          <span className="text-xs text-gray-200">Zoom Level</span>
        </TooltipContent>
      </Tooltip>

      {/* Zoom In */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => props.onZoomChange(Math.min(400, props.zoom + 10))}
            disabled={props.zoom >= 400}
            className="w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-20 transition-colors"
            data-testid="button-zoom-in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-[#252525] border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-200">Zoom In</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-black/40 text-gray-300 rounded font-mono border border-[#3a3a3a]">
              Ctrl++
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Zoom Out */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => props.onZoomChange(Math.max(10, props.zoom - 10))}
            disabled={props.zoom <= 10}
            className="w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-20 transition-colors"
            data-testid="button-zoom-out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-[#252525] border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-200">Zoom Out</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-black/40 text-gray-300 rounded font-mono border border-[#3a3a3a]">
              Ctrl+-
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Reset Zoom */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => props.onZoomChange(100)}
            className="w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            data-testid="button-zoom-reset"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-[#252525] border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-200">Reset to 100%</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-black/40 text-gray-300 rounded font-mono border border-[#3a3a3a]">
              Ctrl+0
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <Separator className="w-8 my-1.5 bg-[#2d2d2d]" />

      {/* Undo */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={props.onUndo}
            disabled={!props.canUndo}
            className="w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-20 transition-colors"
            data-testid="button-undo"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-[#252525] border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-200">Undo</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-black/40 text-gray-300 rounded font-mono border border-[#3a3a3a]">
              Ctrl+Z
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Redo */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={props.onRedo}
            disabled={!props.canRedo}
            className="w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-20 transition-colors"
            data-testid="button-redo"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-[#252525] border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-200">Redo</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-black/40 text-gray-300 rounded font-mono border border-[#3a3a3a]">
              Ctrl+Y
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <Separator className="w-8 my-1.5 bg-[#2d2d2d]" />

      {/* Export */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                data-testid="button-export"
              >
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-[#252525] border-[#3a3a3a]">
              <span className="text-xs text-gray-200">Export</span>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-[#252525] border-[#3a3a3a] text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Export Canvas</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose format and export options
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">Format</Label>
              <RadioGroup value={exportFormat} onValueChange={(v: any) => setExportFormat(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="png" id="fmt-png" />
                  <Label htmlFor="fmt-png" className="text-sm text-gray-300 cursor-pointer">PNG Image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="fmt-pdf" />
                  <Label htmlFor="fmt-pdf" className="text-sm text-gray-300 cursor-pointer">PDF Document</Label>
                </div>
              </RadioGroup>
            </div>
            {exportFormat === "png" && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm text-white">Area</Label>
                  <RadioGroup value={exportArea} onValueChange={(v: any) => setExportArea(v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="visible" id="area-vis" />
                      <Label htmlFor="area-vis" className="text-sm text-gray-300 cursor-pointer">Visible area only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="area-full" />
                      <Label htmlFor="area-full" className="text-sm text-gray-300 cursor-pointer">Full canvas</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-white">Resolution</Label>
                  <RadioGroup value={exportResolution} onValueChange={(v: any) => setExportResolution(v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1x" id="res-1" />
                      <Label htmlFor="res-1" className="text-sm text-gray-300 cursor-pointer">1x (Standard)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2x" id="res-2" />
                      <Label htmlFor="res-2" className="text-sm text-gray-300 cursor-pointer">2x (High-res)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4x" id="res-4" />
                      <Label htmlFor="res-4" className="text-sm text-gray-300 cursor-pointer">4x (Ultra high-res)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-white">Background</Label>
                  <RadioGroup value={exportBg} onValueChange={(v: any) => setExportBg(v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="white" id="bg-w" />
                      <Label htmlFor="bg-w" className="text-sm text-gray-300 cursor-pointer">White</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transparent" id="bg-t" />
                      <Label htmlFor="bg-t" className="text-sm text-gray-300 cursor-pointer">Transparent</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)} className="border-[#3a3a3a] text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleExport} data-testid="button-export-confirm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                data-testid="button-share"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-[#252525] border-[#3a3a3a]">
              <span className="text-xs text-gray-200">Share</span>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-[#252525] border-[#3a3a3a] text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Share Canvas</DialogTitle>
            <DialogDescription className="text-gray-400">
              Share this code for real-time collaboration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {props.currentCanvasCode && (
              <div className="space-y-2">
                <Label className="text-sm text-white">Current Canvas Code</Label>
                <div className="flex gap-2">
                  <Input
                    value={props.currentCanvasCode}
                    readOnly
                    className="h-14 text-2xl font-mono tracking-widest text-center bg-[#1a1a1a] border-[#3a3a3a] text-white"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(props.currentCanvasCode!);
                      console.log("Code copied!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#3a3a3a]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#252525] px-2 text-gray-400">Or join another canvas</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-white">Enter Canvas Code</Label>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleJoinCanvas()}
                placeholder="ABC123"
                maxLength={8}
                className="h-14 text-2xl font-mono tracking-widest text-center bg-[#1a1a1a] border-[#3a3a3a] text-white"
                data-testid="input-join-code"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareOpen(false)} className="border-[#3a3a3a] text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleJoinCanvas} disabled={joinCode.length < 6} data-testid="button-join">
              Join Canvas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1" />

      {/* User Presence at bottom */}
      <div className="flex flex-col items-center gap-1">
        <div
          className={cn(
            "w-11 h-11 flex items-center justify-center rounded",
            props.isConnected ? "bg-emerald-500/15" : "bg-red-500/15"
          )}
          title={props.isConnected ? "Connected" : "Disconnected"}
          data-testid="status-connection"
        >
          {props.isConnected ? (
            <Wifi className="w-4 h-4 text-emerald-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
        </div>

        {/* Active Users Popover */}
        <Popover open={usersOpen} onOpenChange={setUsersOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-11 h-11 text-gray-400 hover:bg-white/5 hover:text-white transition-colors relative",
                usersOpen && "bg-white/10 text-white"
              )}
              data-testid="button-active-users"
              title="Active users"
            >
              <div className="flex flex-col items-center">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-semibold">{displayUserCount}</span>
              </div>
              {displayUserCount > 1 && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            side="left" 
            align="end"
            className="w-72 bg-[#252525] border-[#3a3a3a] text-white shadow-2xl p-0"
            data-testid="popover-active-users"
          >
            <div className="p-4 border-b border-[#3a3a3a]">
              <h3 className="text-sm font-semibold text-white">Active Users</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {displayUserCount} {displayUserCount === 1 ? "user" : "users"} on this canvas
              </p>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-2">
              {(() => {
                const allUsers = [];
                
                // Add current user if available
                if (props.currentUserId && props.currentUserName && props.currentUserColor) {
                  allUsers.push({
                    id: props.currentUserId,
                    name: props.currentUserName,
                    color: props.currentUserColor,
                    tool: props.activeTool || "select",
                    isSelf: true,
                  });
                }
                
                // Add other users
                if (props.users) {
                  allUsers.push(...props.users.map(u => ({ ...u, isSelf: false })));
                }
                
                // Add dummy users for demonstration (only when no other real users)
                if (props.users && props.users.length === 0) {
                  allUsers.push({
                    id: "dummy-1",
                    name: "Sarah Chen",
                    color: "#4ECDC4",
                    tool: "pen",
                    isSelf: false,
                  });
                  allUsers.push({
                    id: "dummy-2",
                    name: "Mike Johnson",
                    color: "#FF6B6B",
                    tool: "text",
                    isSelf: false,
                  });
                  allUsers.push({
                    id: "dummy-3",
                    name: "Emma Davis",
                    color: "#FFEAA7",
                    tool: "rectangle",
                    isSelf: false,
                  });
                }
                
                return allUsers.length > 0 ? (
                  <div className="space-y-1">
                    {allUsers.map((user: any) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors"
                        data-testid={`user-item-${user.id}`}
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white/20"
                          style={{ backgroundColor: user.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">
                            {user.name}
                            {user.isSelf && (
                              <span className="text-xs text-gray-400 ml-1.5">(You)</span>
                            )}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="text-gray-400">
                              {getToolIcon(user.tool)}
                            </div>
                            <span className="text-xs text-gray-400">
                              {getToolName(user.tool)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">You're the only one here</p>
                    <p className="text-xs text-gray-500 mt-1">Share the canvas code to collaborate</p>
                  </div>
                );
              })()}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
