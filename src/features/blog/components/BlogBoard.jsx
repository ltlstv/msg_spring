import { createIdentity, checkIdentity, saveToken, toProtectIdentity, bufferFromBase64, processBuffer, toExposeIdentity, signRequest, importPrivateKey, importPublicKey, verifyRequest} from '../../../services/utils.js';
import { login, logout, register } from '../services/auth-api.js';
import { use, useRef, useState } from 'react';
import Modal from '../../../assets/components/Modal';

export function GuestLayout({ onLogin }) {
  return (  
    <>
      <div style = {{display: 'flex', flexDirection: 'row' }}>
        <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '1vw'}}>
          <div style={{ color: 'white' }}>
            Key 
          </div>
          <div style={{ color: 'white' }}>
            Username 
          </div>
          <div style={{ color: 'white' }}>
            Password 
          </div>
        </div>
        <div style = {{display: 'flex', flexDirection: 'column'}}>
          <input ref={pkeyRef} type="text" id="pkey-i" />
          <input ref={unameRef} type="text" id="uname-i" />
          <input ref={upassRef} type="password" id="upass-i" />
        </div>
      </div>
      <div style = {{display: 'flex', flexDirection: 'row' }}>
      </div>
      <label style = {{color: 'lightgray', marginTop: '3vh'}}>
        <input
          type="checkbox" checked={isKeyLogin} onChange={(e) => setKeyLogin(e.target.checked)}
        />
        use Key instead of u/pass
      </label>
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

export function BlogBoard({ user, onLogin, onLogout }) {
  if (user) {
    return (
      <UserLayout
        username={user.username}
        pfpSrc={user.pfpSrc}
        onLogout={onLogout}
      />
    );
  }
  return (
    <GuestLayout onLogin={onLogin} />
  );
}
