import { LeftToolbar } from '../LeftToolbar';
import { useState } from 'react';

export default function LeftToolbarExample() {
  const [activeTool, setActiveTool] = useState('text');

  return (
    <div className="h-screen bg-background">
      <LeftToolbar
        activeTool={activeTool}
        onToolChange={(tool) => {
          console.log('Tool changed:', tool);
          setActiveTool(tool);
        }}
      />
    </div>
  );
}
