import { createIdentity, checkIdentity, saveToken, protectIdentity} from '../../../services/utils.js';
import { login, logout, register } from '../services/auth-api.js';
import { useRef } from 'react';

export function GuestLayout({ onLogin }) {
  const unameRef = useRef(null);
  const upassRef = useRef(null);

  async function handleLogin() {
    const username = unameRef.current.value.trim();
    const password = upassRef.current.value.trim();

    const data = await login(username, password);

    if (data.token) {
      saveToken(data.token);
      localStorage.setItem('uname', username);
      onLogin({ username });
    } else {
      alert(data.message);
    }
  }

  async function handleRegister() {
    const username = unameRef.current.value.trim();
    const password = upassRef.current.value.trim();

    //UNDER CONSTRUCION
    const identityKeyPair = await createIdentity();
    console.log(await checkIdentity(identityKeyPair));
    const protectedIdentity = await protectIdentity(identityKeyPair.privateKey, "chickenJockey!");
    console.log(protectedIdentity);
    //UNDER CONSTRUCION

    const data = await register(username, password);

    if (data.token) {
      saveToken(data.token);
      localStorage.setItem('uname', username);
      onLogin({ username });
    } else {
      alert(data.message);
    }
  }
  return (  
    <>
      <div style={{ color: 'white' }}>
        Username <input ref={unameRef} type="text" id="uname-i" />
      </div>
      <div style={{ color: 'white' }}>
        Password <input ref={upassRef} type="password" id="upass-i" />
      </div>
      <button type="button" onClick={handleLogin} id="login-btn">
        Login!
      </button>
      <button type="button" onClick={handleRegister} id="register-btn">
        Register!
      </button>
    </>
  );
}

export function UserLayout({ username, pfpSrc, onLogout }) {
  function handleLogout() {
    logout();
    localStorage.removeItem('uname');
    onLogout();
  }
  return (
    <>
      <img
        id="user-pfp"
        src={pfpSrc}
        alt="pfp"
        style={{ maxWidth: 150, maxHeight: 150 }}
      />
      <div className="popup-column" id="popup-user-pfp">
        <button type="button" id="pfp-input-btn">
          Change!
        </button>
        <input
          type="file"
          id="pfp-input-file"
          accept="image/png,image/jpeg,image/webp"
        />
      </div>
      <div style={{ color: 'white' }}>{username}</div>
      <button type="button" onClick={handleLogout} id="logout-btn">
        Logout
      </button>
      <button type="button" id="load-messages-btn">
        Load messages
      </button>
    </>
  );
}

export function AuthBoard({ user, onLogin, onLogout }) {
  if (user) {
    return (
      <UserLayout
        username={user.username}
        pfpSrc={user.pfpSrc}
        onLogout={onLogout}
      />
    );
  }
  return <GuestLayout onLogin={onLogin} />;
}
