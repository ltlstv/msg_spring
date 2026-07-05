function generateMessage(uname, text) { 
    const container = document.getElementById('message-container')

    const message = document.createElement('div');
    message.classList.add('message');

    message.innerHTML = `
        <h3>${uname}</h3>
        <p>${text}</p>
    `

    container.appendChild(message);
}