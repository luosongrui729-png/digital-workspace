import { CodeEntryDialog } from '../CodeEntryDialog';

export default function CodeEntryDialogExample() {
  return (
    <div className="p-4 bg-background">
      <CodeEntryDialog
        currentCanvasCode="A1B2C3"
        onJoinCanvas={(code) => {
          console.log('Joining canvas with code:', code);
        }}
      />
    </div>
  );
}
