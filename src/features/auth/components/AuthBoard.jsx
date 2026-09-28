import { createIdentity, checkIdentity, saveToken, toProtectIdentity, bufferFromBase64, processBuffer, toExposeIdentity, signRequest, importPrivateKey, importPublicKey, verifyRequest} from '../../../services/utils.js';
import { login, logout, register } from '../services/auth-api.js';
import { use, useRef, useState } from 'react';
import Modal from '../../../assets/components/Modal';

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
      <button type="button" onClick={handleLogin} id="login-btn">
        Login!
      </button>
      <button type="button" onClick={handleRegister} id="register-btn">
        Register!
      </button>
      </div>
      <label style = {{color: 'lightgray', marginTop: '3vh'}}>
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
  return (
    <GuestLayout onLogin={onLogin} />
  );
}
