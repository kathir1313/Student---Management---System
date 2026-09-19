// Client-side only theme preference. The backend has no user-settings
// endpoint, so this is stored in localStorage rather than synced anywhere.

const STORAGE_KEY = "sms_theme";

export const getStoredTheme = () =>
  localStorage.getItem(STORAGE_KEY) || "dark";

export const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
};

export const setTheme = (theme) => {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
};

export const initTheme = () => {
  applyTheme(getStoredTheme());
};
