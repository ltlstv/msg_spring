async function send_message(username, message) {

    await fetch(
        "http://localhost:8080/api/messages/new",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, message})
        }
    );
}
