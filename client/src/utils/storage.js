import { STORAGE_KEYS } from "./constants";

const isBrowser = () =>
  typeof window !== "undefined";

export const getStoredToken = () => {
  if (!isBrowser()) {
    return null;
  }

  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const getStoredUser = () => {
  if (!isBrowser()) {
    return null;
  }

  const value = localStorage.getItem(
    STORAGE_KEYS.USER
  );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
};

export const saveAuthStorage = ({
  token,
  user,
}) => {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEYS.TOKEN,
    token
  );

  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user)
  );
};

export const removeAuthStorage = () => {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const setStorageItem = (key, value) => {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
};

export const getStorageItem = (
  key,
  fallback = null
) => {
  if (!isBrowser()) {
    return fallback;
  }

  const value = localStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const removeStorageItem = (key) => {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(key);
};