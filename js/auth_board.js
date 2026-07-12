auth_flag_test = 0
auth_flag_test_btn = document.getElementById('user-auth-btn')
uname = document.getElementById('uname-i')
testButton = document.getElementById('test-button')

//testButton.addEventListener('click', async () => {
//    const message = document.getElementById('xtext-i').value.trim();
//
//    if (!message || !getToken()) return false;
//
//    await generateMessage(message);
//
//    document.getElementById('xtext-i').value = '';
//});

function renderGuestLayout() {
    document.getElementById('user-container').innerHTML = `
        <div style="color:white;">Username <input type="text" id="uname-i" /></div>
        <div style="color:white;">Password <input type="password" id="upass-i" /></div>
        <button id="login-btn">Login!</button><button id="register-btn">Register!</button>
    `;

    document.getElementById("login-btn").addEventListener('click', handleLogin);
    document.getElementById("register-btn").addEventListener('click', handleRegister);
}

function renderUserLayout(uname = 'Alice') {
    document.getElementById('user-container').innerHTML = `
        <img src="assets/img/pfp-placeholder.png" alt="pfp" style="max-width:150px;max-height:150px;">
        <div style="color:white;">${uname}</div>
        <button id="logout-btn">Logout</button>
        <button id="load-messages-btn">Load messages</button>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
        logout();
        renderGuestLayout();
        document.getElementById("message-container").innerHTML = "";
    });

    document.getElementById("load-messages-btn").addEventListener("click", async () => {
        await renderMessages();
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    auth_flag_test_btn.addEventListener('click', async () =>{
        auth_flag_test = auth_flag_test ^ 1;
        if (auth_flag_test == 0) {renderGuestLayout()} else {renderUserLayout()};
        return;
    })
    renderGuestLayout();
})

async function handleLogin() {
    const username = document.getElementById("uname-i").value.trim();
    const password = document.getElementById("upass-i").value.trim();

    const data = await login(username, password);

    if (data.token) {
        saveToken(data.token);
        renderUserLayout(username);
    } else {
        alert(data.message);
    }
}

async function handleRegister() {
    const username = document.getElementById("uname-i").value.trim();
    const password = document.getElementById("upass-i").value.trim();

    const data = await register(username, password);

    if (data.token) {
        saveToken(data.token);
        renderUserLayout(username);
    } else {
        alert(data.message);
    }
}
