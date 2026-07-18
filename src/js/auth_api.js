const API_BASE = "http://localhost:8080";

export async function register(username, password) {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    return await response.json();
}

export async function login(username, password) {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    return await response.json();
}

export function saveToken(token) {
    localStorage.setItem("jwt", token);
}

export function getToken() {
    return localStorage.getItem("jwt");
}

export function logout() {
    localStorage.removeItem("jwt");
}
