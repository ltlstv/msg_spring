const uname = document.getElementById('uname-i');
const xtext = document.getElementById('xtext-i');
const testButton = document.getElementById('test-button');

testButton.addEventListener('click', async () => {
    const username = uname.value.trim();
    const message = xtext.value.trim();

    if (!message || !username) return false;

    await generateMessage(username, message);

    uname.value = '';
    xtext.value = '';
});

async function generateMessage(username, message) {

    const container = document.getElementById('message-container');

    await send_message(username, message);
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
