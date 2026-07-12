async function send_message(message) {
    const token = getToken();

    const response = await fetch(
        "http://localhost:8080/api/messages/new",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({message})
        }
    );

    return await response.json();
}
