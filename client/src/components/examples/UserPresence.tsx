import { UserPresence } from '../UserPresence';
import { useState } from 'react';

export default function UserPresenceExample() {
  const [isConnected] = useState(true);
  const users = [
    { id: '1', name: 'User 1', color: '#FF6B6B', tool: 'Pen' },
    { id: '2', name: 'User 2', color: '#4ECDC4', tool: 'Shape' },
    { id: '3', name: 'User 3', color: '#45B7D1', tool: 'Text' },
  ];

  return (
    <div className="p-4 bg-background">
      <UserPresence users={users} isConnected={isConnected} />
    </div>
  );
}
