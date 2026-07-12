const uname = document.getElementById('uname-i');
const xtext = document.getElementById('xtext-i');
const testButton = document.getElementById('test-button');

testButton.addEventListener('click', async () => {
    const message = document.getElementById('xtext-i').value.trim();
    const recipientUser = document.getElementById('runame-i').value.trim();

    if (!message || !getToken()) return false;

    await generateMessage(recipientUser, message);

    document.getElementById('xtext-i').value = '';
});

async function generateMessage(recipientUser, message) {

    const container = document.getElementById('message-container');

    await send_message(recipientUser, message);

    const data = await get_all_user_messages();
    const messages = data.messages;

    container.innerHTML = '';

    messages.forEach((msg) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `
            <h3>${msg.sender}</h3>
            <p>${msg.message}</p>
        `;
        container.appendChild(messageDiv);
    });
}
