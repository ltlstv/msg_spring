async function send_message(username, message) {
    const token = getToken();

    const response = await fetch(
        "http://localhost:8080/api/messages/new",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({username, message})
        }
    );

    return await response.json();
}
