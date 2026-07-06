async function get_all_messages() {
    const response = await fetch(
        "http://localhost:8080/api/messages/all",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        }
    );

    return await response.json();
}