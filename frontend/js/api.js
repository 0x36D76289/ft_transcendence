import { navigate } from "./spa.js";
import { logMessage } from "./logs.js";

const baseURL = "https://localhost:8000";

export function getUserName() {
  return localStorage.getItem("username");
}

export function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

export async function request(endpoint, method, body) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(`${baseURL}${endpoint}`, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null,
  });

  return response.json();
}

export async function register(inputuser, inputpassword) {
  const data = request("/signup", "POST", {
    username: inputuser,
    password: inputpassword,
  });

  if (data.token) {
    logMessage(`User ${inputuser} registered`, "info");
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", inputuser);
    login(inputuser, inputpassword);
  } else {
    logMessage(`Failed to register: ${data.error}`, "error");
    alert(data.error);
  }
}

export async function login(inputuser, inputpassword) {
  const data = await request("/login", "POST", {
    username: inputuser,
    password: inputpassword,
  });

  if (data.token) {
    logMessage(`User ${inputuser} logged in`, "info");
    localStorage.setItem("token", data.token);
    logMessage(`User ${inputuser} logged in`, "info");
    localStorage.setItem("username", inputuser);
    navigate("/");
  } else {
    logMessage(`Failed to log in: ${data.error}`, "error");
    alert(data.error);
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  navigate("/");
}
