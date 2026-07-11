async function get_all_messages() {
    const token = getToken()

    const response = await fetch(
        "http://localhost:8080/api/messages/all",
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    return await response.json();
}

async function renderMessages() {
    const data = await get_all_messages();
    const messages = data.messages;

    const container = document.getElementById("message-container");
    container.innerHTML = "";

    if (!messages) {
        alert(data.message || data.value || "Could not load messages");
        return;
    }

    messages.forEach((msg) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.innerHTML = `
            <p>${msg.message}</p>
        `;
        container.appendChild(messageDiv);
    });
}