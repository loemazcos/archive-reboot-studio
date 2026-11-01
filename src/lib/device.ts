const DEVICE_ID_KEY = 'taesan-device-id';
const NAME_KEY = 'taesan-player-name';

/** Save slot id for the signed-in player name. Only set after the name screen. */
export function getDeviceId(): string {
  return window.localStorage.getItem(DEVICE_ID_KEY) ?? '';
}

export function getPlayerName(): string | null {
  return window.localStorage.getItem(NAME_KEY);
}

export function setSlot(name: string, deviceId: string) {
  window.localStorage.setItem(NAME_KEY, name);
  window.localStorage.setItem(DEVICE_ID_KEY, deviceId);
}

export function clearSlot() {
  window.localStorage.removeItem(NAME_KEY);
  window.localStorage.removeItem(DEVICE_ID_KEY);
}
