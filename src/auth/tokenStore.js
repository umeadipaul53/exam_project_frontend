let accessToken = sessionStorage.getItem("accessToken") || null;

const listeners = [];

// BroadcastChannel to sync across tabs
const bc = new BroadcastChannel("token_channel");

bc.onmessage = (event) => {
  if (event.data?.type === "SET_TOKEN") {
    accessToken = event.data.token;
    sessionStorage.setItem("accessToken", accessToken);
    listeners.forEach((callback) => callback(accessToken));
  } else if (event.data?.type === "CLEAR_TOKEN") {
    accessToken = null;
    sessionStorage.removeItem("accessToken");
    listeners.forEach((callback) => callback(null));
  }
};

export function getToken() {
  return accessToken;
}

export function setToken(token) {
  accessToken = token;
  sessionStorage.setItem("accessToken", token);
  bc.postMessage({ type: "SET_TOKEN", token });
  listeners.forEach((callback) => callback(token));
}

export function clearToken() {
  accessToken = null;
  sessionStorage.removeItem("accessToken");
  bc.postMessage({ type: "CLEAR_TOKEN" });
  listeners.forEach((callback) => callback(null));
}

// Optional: React apps can subscribe to token changes
export function subscribe(callback) {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) listeners.splice(index, 1);
  };
}
