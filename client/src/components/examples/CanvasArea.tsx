import { CanvasArea } from '../CanvasArea';

export default function CanvasAreaExample() {
  return (
    <div className="h-screen bg-background">
      <CanvasArea
        activeTool="pen"
        strokeColor="#000000"
        fillColor="#FFFFFF"
        zoom={100}
      />
    </div>
  );
}
