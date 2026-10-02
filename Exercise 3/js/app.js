const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");
const root = document.documentElement;
const THEME_KEY = "theme";

function updateThemeButton(theme) {
  const isDark = theme === "dark";

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Enable light mode" : "Enable dark mode",
  );
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  updateThemeButton(theme);
}

themeToggle.addEventListener("click", () => {
  const currentTheme = root.dataset.theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  try {
    window.localStorage.setItem(THEME_KEY, nextTheme);
  } catch {
    // Theme switching still works for this page view without storage access.
  }

  applyTheme(nextTheme);
});

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const submitButton = contactForm.querySelector('button[type="submit"]');
const initialSubmitLabel = submitButton.innerHTML;
let submissionTimer;

function setFormState(state) {
  contactForm.dataset.state = state;
  submitButton.disabled = state === "submitting";

  const messages = {
    idle: "",
    submitting: "Preparing your message…",
    success: "Demo submission complete. This form is not connected to an inbox.",
    error: "Please correct the highlighted fields and try again.",
  };

  submitButton.innerHTML =
    state === "submitting" ? "Preparing… <span aria-hidden=\"true\">…</span>" : initialSubmitLabel;
  formStatus.textContent = messages[state];
}

contactForm.addEventListener(
  "invalid",
  () => {
    window.clearTimeout(submissionTimer);
    setFormState("error");
  },
  true,
);

contactForm.addEventListener("input", () => {
  if (contactForm.dataset.state === "error" && contactForm.checkValidity()) {
    setFormState("idle");
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  window.clearTimeout(submissionTimer);
  setFormState("submitting");

  submissionTimer = window.setTimeout(() => {
    contactForm.reset();
    setFormState("success");
  }, 500);
});

applyTheme(root.dataset.theme === "dark" ? "dark" : "light");
setFormState("idle");
