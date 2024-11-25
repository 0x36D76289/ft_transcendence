import { popupSystem } from '../services/popup.js';

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

  if (response.status === 200) {
    const data = await response.json();
    console.log(data);
    return data;
  } else {
    const data = await response.json();
    popupSystem('error', data.detail);
    console.log(data);
    return null;
  }
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

  if (response.status === 200) {
    const data = await response.json();
    // console.log(data);
    return data;
  } else {
    const data = await response.json();
    popupSystem('error', data.detail);
    // console.log(data);
    return null;
  }
}
