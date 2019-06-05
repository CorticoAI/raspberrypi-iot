const API_URL = '/api';

export function getAvailableNetworks() {
  return fetch(`${API_URL}/networks/`, { method: 'GET' });
}

export function getWifiStatus() {
  return fetch(`${API_URL}/wifi`, { method: 'GET' });
}

export function connectToWifi(ssid, psk) {
  const body = { ssid: ssid, psk: psk };
  return fetch(`${API_URL}/wifi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
