const API_BASE = "http://localhost:8080";

async function register(username, password) {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    return await response.json();
}

async function login(username, password) {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    return await response.json();
}

function saveToken(token) {
    localStorage.setItem("jwt", token);
}

function getToken() {
    return localStorage.getItem("jwt");
}

function logout() {
    localStorage.removeItem("jwt");
}