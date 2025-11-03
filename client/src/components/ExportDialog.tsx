import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download } from "lucide-react";

interface ExportDialogProps {
  onExport: (format: string, options: ExportOptions) => void;
}

interface ExportOptions {
  area: "full" | "visible";
  resolution: "1x" | "2x" | "4x";
  background: "white" | "transparent";
}

export function ExportDialog({ onExport }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"png" | "pdf">("png");
  const [area, setArea] = useState<"full" | "visible">("visible");
  const [resolution, setResolution] = useState<"1x" | "2x" | "4x">("1x");
  const [background, setBackground] = useState<"white" | "transparent">("white");

  const handleExport = () => {
    onExport(format, { area, resolution, background });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 hover-elevate" data-testid="button-export">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" data-testid="dialog-export">
        <DialogHeader>
          <DialogTitle>Export Canvas</DialogTitle>
          <DialogDescription>
            Choose your export format and options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as "png" | "pdf")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="format-png" data-testid="radio-format-png" />
                <Label htmlFor="format-png" className="text-sm cursor-pointer">
                  PNG Image
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="format-pdf" data-testid="radio-format-pdf" />
                <Label htmlFor="format-pdf" className="text-sm cursor-pointer">
                  PDF Document
                </Label>
              </div>
            </RadioGroup>
          </div>

          {format === "png" && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Export Area</Label>
                <RadioGroup value={area} onValueChange={(v) => setArea(v as "full" | "visible")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="visible" id="area-visible" data-testid="radio-area-visible" />
                    <Label htmlFor="area-visible" className="text-sm cursor-pointer">
                      Visible area only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="area-full" data-testid="radio-area-full" />
                    <Label htmlFor="area-full" className="text-sm cursor-pointer">
                      Full canvas
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Resolution</Label>
                <RadioGroup value={resolution} onValueChange={(v) => setResolution(v as "1x" | "2x" | "4x")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1x" id="res-1x" data-testid="radio-resolution-1x" />
                    <Label htmlFor="res-1x" className="text-sm cursor-pointer">
                      1x (Standard)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2x" id="res-2x" data-testid="radio-resolution-2x" />
                    <Label htmlFor="res-2x" className="text-sm cursor-pointer">
                      2x (High-res)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4x" id="res-4x" data-testid="radio-resolution-4x" />
                    <Label htmlFor="res-4x" className="text-sm cursor-pointer">
                      4x (Ultra high-res)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Background</Label>
                <RadioGroup value={background} onValueChange={(v) => setBackground(v as "white" | "transparent")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="white" id="bg-white" data-testid="radio-bg-white" />
                    <Label htmlFor="bg-white" className="text-sm cursor-pointer">
                      White
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transparent" id="bg-transparent" data-testid="radio-bg-transparent" />
                    <Label htmlFor="bg-transparent" className="text-sm cursor-pointer">
                      Transparent
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-export">
            Cancel
          </Button>
          <Button onClick={handleExport} data-testid="button-confirm-export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
