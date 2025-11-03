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
import { Input } from "@/components/ui/input";
import { Share2 } from "lucide-react";

interface CodeEntryDialogProps {
  onJoinCanvas: (code: string) => void;
  currentCanvasCode?: string;
}

export function CodeEntryDialog({
  onJoinCanvas,
  currentCanvasCode,
}: CodeEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (code.length < 6) {
      setError("Please enter a valid 6-8 character code");
      return;
    }
    onJoinCanvas(code.toUpperCase());
    setOpen(false);
    setCode("");
    setError("");
  };

  const handleCopyCode = () => {
    if (currentCanvasCode) {
      navigator.clipboard.writeText(currentCanvasCode);
      console.log('Code copied to clipboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 hover-elevate" data-testid="button-share">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" data-testid="dialog-code-entry">
        <DialogHeader>
          <DialogTitle>Share Canvas</DialogTitle>
          <DialogDescription>
            Share this code with others to collaborate in real-time
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {currentCanvasCode && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Canvas Code</p>
              <div className="flex gap-2">
                <Input
                  value={currentCanvasCode}
                  readOnly
                  className="h-14 text-2xl font-mono tracking-widest text-center"
                  data-testid="input-current-code"
                />
                <Button onClick={handleCopyCode} data-testid="button-copy-code">
                  Copy
                </Button>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or join another canvas
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Enter Canvas Code</p>
            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="ABC123"
              className="h-14 text-2xl font-mono tracking-widest text-center"
              maxLength={8}
              data-testid="input-join-code"
            />
            {error && (
              <p className="text-sm text-destructive" data-testid="text-error">
                {error}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-join">
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={code.length < 6} data-testid="button-join-canvas">
            Join Canvas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
