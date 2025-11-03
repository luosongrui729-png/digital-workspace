import { Canvas } from '../Canvas';
import { useState } from 'react';

export default function CanvasExample() {
  const [showGrid] = useState(true);

  return (
    <div className="h-screen bg-background">
      <Canvas
        activeTool="pen"
        strokeColor="#000000"
        fillColor="#FFFFFF"
        zoom={100}
        showGrid={showGrid}
      />
    </div>
  );
}
