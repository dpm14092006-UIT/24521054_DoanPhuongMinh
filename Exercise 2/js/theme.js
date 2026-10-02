const THEME_KEY = "theme";

const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;

function applyTheme(theme) {
  root.dataset.theme = theme;

  const isDark = theme === "dark";

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}

function getStoredTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function getPreferredTheme() {
  const storedTheme = getStoredTheme();

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function toggleTheme() {
  const currentTheme = root.dataset.theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  try {
    window.localStorage.setItem(THEME_KEY, nextTheme);
  } catch {
    // Theme switching still works for this page view without storage access.
  }

  applyTheme(nextTheme);
}

applyTheme(getPreferredTheme());
themeToggle.addEventListener("click", toggleTheme);
