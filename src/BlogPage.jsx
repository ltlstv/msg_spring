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

const BlogPage = () => {
  const { username } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`/api/user/blog/${username}`)
      .then(r => r.json())
      .then(setBlog());
  }, [username]);

  return <BlogRenderer data={blog} />;
}

const BlogRenderer = () => {
  return (
    <div id="bg-container" style={bgContainerStyle}>
      <div id="blog-layout">
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
      </ul>

      <img id="maiden-img" src={maidenImg} alt="" />
     
    </div>
  );
};

export default BlogPage;
