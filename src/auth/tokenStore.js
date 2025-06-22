let accessToken = sessionStorage.getItem("accessToken") || null;
let userRole = sessionStorage.getItem("userRole") || null;

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

export function getRole() {
  return userRole;
}

export function setRole(role) {
  userRole = role;
  sessionStorage.setItem("userRole", role);
}

export function clearRole() {
  userRole = null;
  sessionStorage.removeItem("userRole");
}

// Always get fresh token from sessionStorage
export function getToken() {
  return sessionStorage.getItem("accessToken");
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
  clearRole();
  bc.postMessage({ type: "CLEAR_TOKEN" });
  listeners.forEach((callback) => callback(null));
}

export function subscribe(callback) {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) listeners.splice(index, 1);
  };
}

// 🆕 Wait for token to be available (useful during page refresh)
export function waitForToken(timeout = 3000) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (token) return resolve(token);

    const timeoutId = setTimeout(
      () => reject(new Error("Token timeout")),
      timeout
    );

    const unsubscribe = subscribe((newToken) => {
      if (newToken) {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve(newToken);
      }
    });
  });
}
