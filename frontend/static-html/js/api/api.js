import { setCookie, getCookie, deleteCookie, getToken } from '../utils/cookies.js';

export const API_BASE_URL = 'https://localhost:8443/api';
export const WS_BASE_URL = 'wss://localhost:8443/ws';
const headers = {
  'Content-Type': 'application/json',
};

function handleResponse(response) {
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  return response.json();
}

function displayCurlEquivalent(method, endpoint, body = {}) {
  const token = getToken();
  const headersString = token ? `-H "Authorization: Token ${token}" -H "Content-Type: application/json"` : `-H "Content-Type: application/json"`;
  const bodyString = method === 'POST' ? `-d '${JSON.stringify(body)}'` : '';
  console.log(`curl -X ${method} ${headersString} ${bodyString} ${API_BASE_URL}${endpoint}`);
}

export async function get(endpoint) {
  displayCurlEquivalent('GET', endpoint);
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: token ? { ...headers, Authorization: `Token ${token}` } : headers,
  });
  return handleResponse(res);
}

export async function post(endpoint, body = {}) {
  displayCurlEquivalent('POST', endpoint, body);
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: token ? { ...headers, Authorization: `Token ${token}` } : headers,
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}