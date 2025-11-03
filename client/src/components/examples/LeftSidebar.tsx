import { LeftSidebar } from '../LeftSidebar';
import { useState } from 'react';

export default function LeftSidebarExample() {
  const [activeTool, setActiveTool] = useState('select');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#000000');
  const [penSize, setPenSize] = useState(5);
  const [penOpacity, setPenOpacity] = useState(100);
  const [penType, setPenType] = useState('standard');
  const [eraserSize, setEraserSize] = useState(20);
  const [textSize, setTextSize] = useState(16);
  const [textAlign, setTextAlign] = useState('left');
  const [showGrid, setShowGrid] = useState(false);

  return (
    <div className="h-screen bg-background flex">
      <LeftSidebar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        strokeColor={strokeColor}
        fillColor={fillColor}
        textColor={textColor}
        onStrokeColorChange={setStrokeColor}
        onFillColorChange={setFillColor}
        onTextColorChange={setTextColor}
        penSize={penSize}
        onPenSizeChange={setPenSize}
        penOpacity={penOpacity}
        onPenOpacityChange={setPenOpacity}
        penType={penType}
        onPenTypeChange={setPenType}
        eraserSize={eraserSize}
        onEraserSizeChange={setEraserSize}
        textSize={textSize}
        onTextSizeChange={setTextSize}
        textAlign={textAlign}
        onTextAlignChange={setTextAlign}
        onImageInsert={() => console.log('Insert image')}
        showGrid={showGrid}
        onGridToggle={() => setShowGrid(!showGrid)}
      />
    </div>
  );
}
