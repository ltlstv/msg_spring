import { useState } from 'react';
import { AuthPanel } from '../features/auth/components/AuthPanel.jsx';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import { ChatPanel } from '../features/chat/components/ChatPanel.jsx';
import { Tabs } from '../features/navigation/components/Tabs.jsx';
import './app.css';

const tabs = [
  { id: 'auth', label: 'User' },
  { id: 'chat', label: 'Chat' },
  { id: 'music', label: 'Music' },
  { id: 'diagnostics', label: 'Diagnostics' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('auth');
  const auth = useAuth();

  return (
    <main className="messenger-shell">
      <div className="messenger-grid">
        <AuthPanel
          className={activeTab === 'auth' ? 'is-active' : ''}
          auth={auth}
        />

        <ChatPanel
          className={activeTab === 'chat' ? 'is-active' : ''}
          currentUser={auth.user?.username}
          token={auth.token}
        />
      </div>

      <Tabs activeTab={activeTab} tabs={tabs} onChange={setActiveTab} />
    </main>
  );
}
