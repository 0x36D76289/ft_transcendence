import { getToken } from '../utils/cookies.js';

export const API_BASE_URL = 'https://localhost:8443/api';
export const WS_BASE_URL = 'wss://localhost:8443/api/ws';

export async function get(endpoint, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: headers,
  });

  console.log(`curl -X GET "${API_BASE_URL}${endpoint}" -H "Content-Type: application/json"${token ? ` -H "Authorization: Token ${token}"` : ''}`);
  console.log(response);

  return response.json();
}

export async function post(endpoint, body = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  });

  console.log(`curl -X POST "${API_BASE_URL}${endpoint}" -H "Content-Type: application/json"${token ? ` -H "Authorization: Token ${token}"` : ''} -d '${JSON.stringify(body)}'`);
  console.log(response);

  return response.json();
}
