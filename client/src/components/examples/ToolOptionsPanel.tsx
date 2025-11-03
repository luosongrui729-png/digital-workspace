import { ToolOptionsPanel } from '../ToolOptionsPanel';
import { useState } from 'react';

export default function ToolOptionsPanelExample() {
  const [penOptions, setPenOptions] = useState<{
    size: number;
    opacity: number;
    type: "standard" | "marker" | "highlighter";
  }>({
    size: 5,
    opacity: 100,
    type: 'standard',
  });
  const [selectedShape, setSelectedShape] = useState('rectangle');

  return (
    <div className="flex flex-col gap-4 p-4 bg-background">
      <ToolOptionsPanel
        tool="pen"
        penOptions={penOptions}
        onPenOptionsChange={(options) => {
          console.log('Pen options changed:', options);
          setPenOptions(options);
        }}
      />
      <ToolOptionsPanel
        tool="shapes"
        selectedShape={selectedShape}
        onShapeSelect={(shapeId) => {
          console.log('Shape selected:', shapeId);
          setSelectedShape(shapeId);
        }}
      />
    </div>
  );
}
