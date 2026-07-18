import pfpPlaceholder from '../assets/img/pfp-placeholder.png';
import { login, logout, register, saveToken } from './auth_api';
import { renderMessages } from './get_all_user_messages';

let authFlagTest = 0;

export function initAuthBoard() {
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
        <img src="${pfpPlaceholder}" alt="pfp" style="max-width:150px;max-height:150px;">
        <div style="color:white;">${uname}</div>
        <button type="button" id="logout-btn">Logout</button>
        <button type="button" id="load-messages-btn">Load messages</button>
    `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
    renderGuestLayout();
    document.getElementById('message-container').innerHTML = '';
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
  } else {
    alert(data.message);
  }
}
