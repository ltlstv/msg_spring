import { createIdentity, saveToken, toProtectIdentity, bufferFromBase64, processBuffer, toExposeIdentity, signRequest, importPrivateKey, importPublicKey, verifyRequest, getUserPfpURL, uploadUserPfp } from '../../../services/utils.js';
import { login, logout, register } from '../services/auth-api.js';
import { useEffect, useRef, useState } from 'react';
import pfpPlaceholder from '../../../assets/img/pfp-placeholder.png';
import Modal from '../../../assets/components/Modal';
import './AuthBoard.css';

const modalInputStyle = {
  display: 'flex',
  flexDirection: 'row',
};

export function GuestLayout({ onLogin }) {

  // login/register inputs
  const pkeyRef = useRef(null);
  const unameRef = useRef(null);
  const upassRef = useRef(null);
  // login checkbox true/false
  const [isKeyLogin, setKeyLogin] = useState(false);
  // modal isOpen true/false
  const [openCryptoModal, setOpenCryptoModal] = useState(false);
  // crypto modal refs and states
  const payloadRef = useRef(null);
  const [publickeyState, setPublicKeyState] = useState(null);
  const [signatureState, setSignatureState] = useState(null);

  async function handleLogin() {
    const pkey = pkeyRef.current.value.trim();
    const username = unameRef.current.value.trim();
    const password = upassRef.current.value.trim();

    if (isKeyLogin==true) {
      try {
        let privateKey;

        if(pkey==""){
          const protectedIdentity = {
            privateKey: bufferFromBase64(
              localStorage.getItem(`${username}_ProtectedPrivateKey`)
            ),
            salt: bufferFromBase64(
              localStorage.getItem(`${username}_IdentitySalt`)
            ),
            iv: bufferFromBase64(
              localStorage.getItem(`${username}_IdentityIV`)
            ),
          };

          privateKey = await toExposeIdentity(protectedIdentity,password);

        } else {
          
          privateKey = await importPrivateKey(bufferFromBase64(pkey));

        };
        const signature = await signRequest(privateKey);
        console.log(processBuffer(signature));
        
      }
      catch(err) {
        console.log(err)
      }
    }

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

    // creating and saving private identity
    const identityKeyPair = await createIdentity();
    const protectedIdentity = await toProtectIdentity(identityKeyPair.privateKey, password);
    localStorage.setItem(
      `${username}_ProtectedPrivateKey`, processBuffer(protectedIdentity.privateKey)
    );
    localStorage.setItem(
      `${username}_IdentitySalt`, processBuffer(protectedIdentity.salt)
    );
    localStorage.setItem(
      `${username}_IdentityIV`, processBuffer(protectedIdentity.iv)
    );

    // saving public identity (test)
    const publicKeyBuffer = await crypto.subtle.exportKey(
      'spki',
      identityKeyPair.publicKey
    );
    localStorage.setItem(
      `${username}_PublicKey`,
      processBuffer(publicKeyBuffer)
    )

    const data = await register(username, password);

    if (data.token) {
      saveToken(data.token);  
      localStorage.setItem('uname', username);
      onLogin({ username });
    } else {
      alert(data.message);
    }
  }

  const handleCloseCryptoModal = () => {
    setOpenCryptoModal(false);
  };

  const handleOpenCryptoModal = () => {
    setOpenCryptoModal(true);
  };

  async function handleSignTest() {
      try {
          const username = unameRef.current.value.trim();
          const password = upassRef.current.value.trim();
          const payload = payloadRef.current.value;

          const protectedIdentity = {
              privateKey: bufferFromBase64(
                  localStorage.getItem(`${username}_ProtectedPrivateKey`)
              ),
              salt: bufferFromBase64(
                  localStorage.getItem(`${username}_IdentitySalt`)
              ),
              iv: bufferFromBase64(
                  localStorage.getItem(`${username}_IdentityIV`)
              )
          };

          const privateKey = await toExposeIdentity(
              protectedIdentity,
              password
          );

          const signature = await signRequest(
              privateKey,
              payload
          );



          setSignatureState(processBuffer(signature));
          setPublicKeyState(localStorage.getItem(`${username}_PublicKey`));

      } catch (err) {
          console.error(err);
      }
  }


  async function handleVerifyTest() {
      try {
          const publicKey = await importPublicKey(
              bufferFromBase64(
                  publickeyState.trim()
              )
          );

          const payload = payloadRef.current.value;

          const signature = bufferFromBase64(
              signatureState.trim()
          );

          const valid = await verifyRequest(
              publicKey,
              payload,
              signature
          );

          console.log("Signature valid:", valid);

          alert(valid ? "VALID" : "INVALID");

      } catch (err) {
          console.error(err);
      }
  }

  return (  
    <>
      <div className="auth-form-row">
        <div className="auth-form-labels">
          <div className="auth-form-label">
            Key 
          </div>
          <div className="auth-form-label">
            Username 
          </div>
          <div className="auth-form-label">
            Password 
          </div>
        </div>
        <div className="auth-form-inputs">
          <input ref={pkeyRef} type="text" id="pkey-i" />
          <input ref={unameRef} type="text" id="uname-i" />
          <input ref={upassRef} type="password" id="upass-i" />
        </div>
      </div>
      <div className="auth-form-actions">
      <button type="button" onClick={handleLogin} id="login-btn">
        Login!
      </button>
      <button type="button" onClick={handleRegister} id="register-btn">
        Register!
      </button>
      </div>
      <label className="auth-key-login">
        <input
          type="checkbox" checked={isKeyLogin} onChange={(e) => setKeyLogin(e.target.checked)}
        />
        use Key instead of u/pass
      </label>
      <button type="button" onClick={handleOpenCryptoModal}>Crypto Modal</button>
      <Modal isOpen={openCryptoModal} onClose={handleCloseCryptoModal} label="Crypto Menu">
        {/*<div style={modalInputStyle}>username <input ref={unameRef} type="text"/></div>
        <div style={modalInputStyle}>password <input ref={upassRef} type="text"/></div>
        <div style={modalInputStyle}>private key <input ref={pkeyRef} type="text"/></div>
        <div style={modalInputStyle}>public key <input ref={publickeyRef} type="text"/></div>
        <div style={modalInputStyle}>signature <input ref={signatureRef} type="text"/></div>>*/}
        <div style={modalInputStyle}>payload <input ref={payloadRef} type="text"/></div>
        <button onClick={handleSignTest}> Sign </button>
        <button onClick={handleVerifyTest}> Verify </button>
      </Modal>
    </> 
  );
}

export function UserLayout({ username, pfpURL, onLogout }) {
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(pfpURL || pfpPlaceholder);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);

  useEffect(() => {
    let active = true;

    getUserPfpURL()
      .then((url) => {
        if (active) setAvatarUrl(url || pfpPlaceholder);
      })
      .catch((error) => {
        console.error('Could not load profile avatar:', error);
      });

    return () => {
      active = false;
    };
  }, [username]);

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Choose a JPEG or PNG image.');
      event.target.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('The image must be 8 MB or smaller.');
      event.target.value = '';
      return;
    }

    setUploadingAvatar(true);
    try {
      const url = await uploadUserPfp(file);
      if (url) setAvatarUrl(url);
    } catch (error) {
      alert(error.message || 'Avatar upload failed.');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  }

  function handleLogout() {
    logout();
    localStorage.removeItem('uname');
    onLogout();
  }
  return (
    <>
      <div className="profile-avatar-menu">
        <button
          type="button"
          className="profile-avatar-trigger"
          aria-label="Change profile picture"
          aria-expanded={showAvatarPopup}
          aria-controls="popup-user-pfp"
          onClick={() => setShowAvatarPopup((show) => !show)}
        >
          <img id="user-pfp" src={avatarUrl} alt="" className="user-pfp" />
        </button>
        <div
          className={`profile-avatar-popup${showAvatarPopup ? ' is-open' : ''}`}
          id="popup-user-pfp"
        >
          <button
            type="button"
            id="pfp-input-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
          >
          {uploadingAvatar ? 'Uploading…' : 'Change!'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            id="pfp-input-file"
            accept="image/png,image/jpeg"
            onChange={handleAvatarChange}
          />
        </div>
      </div>
      <div className="auth-username">{username}</div>
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
        pfpURL={user.avatarUrl}
        onLogout={onLogout}
      />
    );
  }
  return (
    <GuestLayout onLogin={onLogin} />
  );
}
