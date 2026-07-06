const uname = document.getElementById('uname-i');
const xtext = document.getElementById('xtext-i');
const testButton = document.getElementById('test-button');

testButton.addEventListener('click', () => {
    const username = uname.value.trim();
    const message = xtext.value.trim();

    uname.value = '';
    xtext.value = '';

    generateMessage(username, message);

});

async function generateMessage(uname, text) {
    const container = document.getElementById('message-container');

    await send_message(uname, text);
    const data = await get_all_messages();
    const messages = data.allMessages;

    container.innerHTML = '';

    messages.forEach((msg) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `
            <h3>${msg.username}</h3>
            <p>${msg.message}</p>
        `;
        container.appendChild(messageDiv);
    });
}