import './assets/style.css';
import './assets/MessengerPage.css';
import { useEffect, useState } from 'react';
import maidenImg from './assets/img/maiden.png';
import { AuthBoard } from './features/auth/components/AuthBoard';
import { MessageBoard } from './features/chat/components/MessageBoard';
import { initTabsBoard } from './features/navi/services/tabs-board';
import { connect_ws } from './services/ws-connection';
import { getCurrentUname } from './services/utils';


const MessengerPage = () => {
  const [user, setUser] = useState(null);
  const [activeDialogueUser, setActiveDialogueUser] = useState(null);
  const [dialogues, setDialogues] = useState({});

  /// messaging
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
  /// messaging

  /// login and logout
  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    connect_ws(addMessage);
  }

  function handleLogout() {
    setUser(null);
    setActiveDialogueUser(null);
    setDialogues({});
  }
  /// login and logout

  /// set active tab on default
  useEffect(() => {
    const cleanupTabsBoard = initTabsBoard();

    return () => {
      cleanupTabsBoard();
    };
  }, []);
  /// set active tab on default

  /// auth check
  useEffect(() => {
    const currentUname = getCurrentUname();
    if(currentUname!='' && currentUname){
      setUser({ username: currentUname });
    }
  }, []);
  /// auth check
  
  return (
    <div id="bg-container" className="bg-container">
      <div id="chat-layout" className="chat-layout">
        <section
          id="user-window"
          className="app-window user-window active-tab"
          data-msg-tab-content
        >
          <div id="user-container-header" className="app-window-header">
            Authorization
          </div>
          <div id="user-container" className="user-container">
            <AuthBoard
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </div>
        </section>

        <section
          id="dialogue-window"
          className="app-window dialogue-window-panel"
          data-msg-tab-content
        >
          <div id="dialogue-container-header" className="app-window-header">
            Chat
          </div>
          <div id="dialogue-container" className="dialogue-container text-center">
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
        <li data-msg-tab-target="#user-window">
          User
        </li>
        <li data-msg-tab-target="#dialogue-window">
          Chat
        </li>
        <li data-msg-tab-target="#music-window">
          Music
        </li>
        <li data-msg-tab-target="#diagn-window">
          DGNSTCS
        </li>
      </ul>

      <img id="maiden-img" className="maiden-img" src={maidenImg} alt="" />

      <div
        id="music-window"
        className="app-window floating-window music-window"
        data-msg-tab-content
      >
        <div id="music-window-header" className="app-window-header">
          Music player
        </div>
        <div id="music-container"></div>
      </div>

      <div
        id="diagn-window"
        className="app-window floating-window diagn-window"
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

export default MessengerPage;
