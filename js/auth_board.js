auth_flag_test = 0
auth_flag_test_btn = document.getElementById('user-auth-btn')
uname = document.getElementById('uname-i')

function renderGuestLayout() {
    document.getElementById('user-container').innerHTML = `
        <div style="color:white;">Username <input type="text" id="uname-i" /></div>
        <div style="color:white;">Password <input type="password" id="upass-i" /></div>
        <button id="login-btn">Login!</button><button id="register-btn">Register!</button>
    `;
}

function renderUserLayout(uname = 'Alice') {
    document.getElementById('user-container').innerHTML = `
        <img src="assets/img/pfp-placeholder.png" alt="pfp" style="max-width:150px;max-height:150px;">
        <div style="color:white;">${uname}</div>
        <button id="logout-btn">Logout</button>
        <button id="load-messages-btn">Load messages</button>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    auth_flag_test_btn.addEventListener('click', async () =>{
        auth_flag_test = auth_flag_test ^ 1;
        if (auth_flag_test == 0) {renderGuestLayout()} else {renderUserLayout()};
        return;
    })
    renderGuestLayout();
})