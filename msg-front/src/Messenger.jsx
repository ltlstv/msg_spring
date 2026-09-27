import './assets/style.css';
import { useEffect, useState } from 'react';
import maidenImg from './assets/img/maiden.png';
import { AuthBoard } from './features/auth/components/AuthBoard';
import { MessageBoard } from './features/chat/components/MessageBoard';
import { initTabsBoard } from './features/navi/services/tabs-board';
import { connect_ws } from './services/ws-connection';

const bgContainerStyle = {
  maxWidth: '70%',
  height: 'auto',
  textAlign: 'center',
  position: 'absolute',
  display: 'flex',
};

const appWindowStyle = {
  backgroundColor: '#3b3b3bb2',
  width: '95%',
};

const centeredStyle = {
  textAlign: 'center',
};

const tabStyle = {
  padding: '0.5em',
  border: '0.5em solid rgb(219, 219, 219)',
  backgroundColor: '#3b3b3bb2',
};

const floatingWindowStyle = {
  display: 'none',
  width: '18vw',
  height: '18vh',
  backgroundColor: '#3b3b3bb2',
};

const Messenger = () => {
  const [user, setUser] = useState(null);
  const [activeDialogueUser, setActiveDialogueUser] = useState(null);
  const [dialogues, setDialogues] = useState({});

  function getDialogueUser(message) {
    return message.recipientUser ?? message.sender;
  }

  function addMessage(message, options = {}) {
    const dialogueUser = getDialogueUser(message);

    if (!dialogueUser) {
      return;
    }

    setDialogues((current) => ({
      ...current,
      [dialogueUser]: {
        user: dialogueUser,
        messages: [...(current[dialogueUser]?.messages ?? []), message],
      },
    }));

    if (options.activate) {
      setActiveDialogueUser(dialogueUser);
    } else {
      setActiveDialogueUser((current) => current ?? dialogueUser);
    }
  }

  function handleMessageSent(sentMessage) {
    addMessage(sentMessage, { activate: true });
  }

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    connect_ws(addMessage);
  }

  function handleLogout() {
    setUser(null);
    setActiveDialogueUser(null);
    setDialogues({});
  }

  useEffect(() => {
    const cleanupTabsBoard = initTabsBoard();

    return () => {
      cleanupTabsBoard();
    };
  }, []);

  return (
    <div id="bg-container" style={bgContainerStyle}>
      <div id="chat-layout">
        <section
          id="user-window"
          style={appWindowStyle}
          className="app-window active-tab"
          data-msg-tab-content
        >
          <div id="user-container-header" className="app-window-header">
            Authorization
          </div>
          <div id="user-container">
            <AuthBoard
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
              style={centeredStyle}
            />
          </div>
        </section>

        <section
          id="dialogue-window"
          className="app-window"
          style={appWindowStyle}
          data-msg-tab-content
        >
          <div id="dialogue-container-header" className="app-window-header">
            Chat
          </div>
          <div id="dialogue-container" style={centeredStyle}>
            <MessageBoard
              activeDialogueUser={activeDialogueUser}
              dialogues={dialogues}
              onActiveDialogueUserChange={setActiveDialogueUser}
              onMessageSent={handleMessageSent}
            />
          </div>
        </section>
      </div>

      <ul className="msg-tabs">
        <li data-msg-tab-target="#user-window" style={tabStyle}>
          User
        </li>
        <li data-msg-tab-target="#dialogue-window" style={tabStyle}>
          Chat
        </li>
        <li data-msg-tab-target="#music-window" style={tabStyle}>
          Music
        </li>
        <li data-msg-tab-target="#diagn-window" style={tabStyle}>
          DGNSTCS
        </li>
      </ul>

      <img id="maiden-img" src={maidenImg} alt="" />

      <div
        id="music-window"
        style={floatingWindowStyle}
        className="app-window"
        data-msg-tab-content
      >
        <div id="music-window-header" className="app-window-header">
          Music player
        </div>
        <div id="music-container"></div>
      </div>

      <div
        id="diagn-window"
        style={floatingWindowStyle}
        className="app-window"
        data-msg-tab-content
      >
        <div id="diagn-window-header" className="app-window-header">
          Diagnostics
        </div>
        <div id="diagn-container">
          <button type="button" id="user-auth-btn">
            Change auth flag
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
