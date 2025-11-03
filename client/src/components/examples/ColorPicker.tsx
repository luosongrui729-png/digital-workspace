import { ColorPicker } from '../ColorPicker';
import { useState } from 'react';

export default function ColorPickerExample() {
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#FFFFFF');

  return (
    <div className="flex gap-2 p-4 bg-background">
      <ColorPicker
        label="Stroke"
        value={strokeColor}
        onChange={(color) => {
          console.log('Stroke color changed:', color);
          setStrokeColor(color);
        }}
        type="stroke"
      />
      <ColorPicker
        label="Fill"
        value={fillColor}
        onChange={(color) => {
          console.log('Fill color changed:', color);
          setFillColor(color);
        }}
        type="fill"
      />
    </div>
  );
}
