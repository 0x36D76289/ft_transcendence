import { getToken } from '../utils/cookies.js';

export const API_BASE_URL = 'https://localhost:8443/api';
export const WS_BASE_URL = 'wss://localhost:8443/ws';

// function handleResponse(response) {
//   console.log(response);
//   if (response.ok == false) {
// 	throw new Error(`Error: ${response.status}`);
//   }
//   return response.json();
// }

function displayCurlEquivalent(method, endpoint, body = {}) {
  console.log(`curl -X ${method} ${API_BASE_URL}${endpoint} -H "Content-Type: application/json" -d '${JSON.stringify(body)}'`);
}

export async function get(endpoint) {
  displayCurlEquivalent('GET', endpoint);

  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  return response.json();
}

export async function post(endpoint, body = {}) {
  displayCurlEquivalent('POST', endpoint, body);

  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(body),
  });

  return response.json();
}
