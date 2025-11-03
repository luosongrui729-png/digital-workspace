import { ToolButton } from '../ToolButton';
import { Pen, Eraser } from 'lucide-react';
import { useState } from 'react';

export default function ToolButtonExample() {
  const [activeTool, setActiveTool] = useState('pen');

  return (
    <div className="flex gap-2 p-4 bg-background">
      <ToolButton
        icon={<Pen className="w-5 h-5" />}
        label="Pen Tool"
        shortcut="P"
        isActive={activeTool === 'pen'}
        onClick={() => {
          console.log('Pen tool clicked');
          setActiveTool('pen');
        }}
      />
      <ToolButton
        icon={<Eraser className="w-5 h-5" />}
        label="Eraser Tool"
        shortcut="E"
        isActive={activeTool === 'eraser'}
        onClick={() => {
          console.log('Eraser tool clicked');
          setActiveTool('eraser');
        }}
      />
    </div>
  );
}
