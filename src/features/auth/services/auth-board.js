import pfpPlaceholder from '../../../assets/img/pfp-placeholder.png';
import { saveToken } from '../../../services/utils.js';
import { connect_ws } from '../../../services/ws-connection.js';
import { renderMultipleMessages as renderMessages } from '../../chat/services/render-message.js';
import { login, logout, register, uploadUserPfpImg } from './auth-api.js';

let authFlagTest = 0;

export function initAuthBoard(onLogin) {
  const authFlagTestButton = document.getElementById('user-auth-btn');

  if (!authFlagTestButton) {
    return () => {};
  }

  const handleAuthFlagClick = async () => {
    authFlagTest = authFlagTest ^ 1;
    if (authFlagTest === 0) {
      renderGuestLayout();
    } else {
      renderUserLayout();
    }
  };

  authFlagTestButton.addEventListener('click', handleAuthFlagClick);
  renderGuestLayout();

  return () => {
    authFlagTestButton.removeEventListener('click', handleAuthFlagClick);
  };
}

function renderGuestLayout() {
  document.getElementById('user-container').innerHTML = `
        <div style="color:white;">Username <input type="text" id="uname-i" /></div>
        <div style="color:white;">Password <input type="password" id="upass-i" /></div>
        <button type="button" id="login-btn">Login!</button><button type="button" id="register-btn">Register!</button>
    `;

  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document
    .getElementById('register-btn')
    .addEventListener('click', handleRegister);
}

function renderUserLayout(uname = 'Alice') {
  document.getElementById('user-container').innerHTML = `
        <img id="user-pfp" src="${pfpPlaceholder}" alt="pfp" style="max-width:150px;max-height:150px;">
        <div class="popup-column" id="popup-user-pfp">

          <button id="pfp-input-btn">Change!</button>
          <input type="file" id="pfp-input-file" accept="image/png,image/jpeg,image/webp">
          
        </div>
        <div style="color:white;">${uname}</div>
        <button type="button" id="logout-btn">Logout</button>
        <button type="button" id="load-messages-btn">Load messages</button>
    `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
    renderGuestLayout();
    document.getElementById('message-container').innerHTML = '';
  });

  document.getElementById('user-pfp').addEventListener('click', () => {
    const popup = document.getElementById('popup-user-pfp');
    popup.classList.toggle("popupShow");

    return;
  });


  document.getElementById('pfp-input-btn').addEventListener('click', async () => {
    const allowedTypes = ['image/png', 'image,jpeg', 'image/webp']
    
    const input = document.getElementById('pfp-input-file');
    const file = input.files[0];

    if (!file || !allowedTypes.includes(file.type)) {
      input.value = '';
      alert("File is empty or does not match requirements:\nOnly jpeg, png and webp are allowed;")
      return;
    }

    const data = await uploadUserPfpImg(file);

    if (data.avatarUrl) {
      document.getElementById('user-pfp').src = data.avatarUrl;
    }

    input.value = '';
  });

  document
    .getElementById('load-messages-btn')
    .addEventListener('click', async () => {
      await renderMessages();
    });
}

async function handleLogin() {
  const username = document.getElementById('uname-i').value.trim();
  const password = document.getElementById('upass-i').value.trim();

  const data = await login(username, password);

  if (data.token) {
    saveToken(data.token);
    renderUserLayout(username);
    localStorage.setItem("uname", username)

    onlogin()

  } else {
    alert(data.message);

  }
}

async function handleRegister() {
  const username = document.getElementById('uname-i').value.trim();
  const password = document.getElementById('upass-i').value.trim();

  const data = await register(username, password);

  if (data.token) {
    saveToken(data.token);
    renderUserLayout(username);
    connect_ws();
  } else {
    alert(data.message);
  }
}
