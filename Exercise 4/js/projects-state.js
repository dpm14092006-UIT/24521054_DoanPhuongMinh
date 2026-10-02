const projectPanel = document.querySelector(".project-panel");
const stateElements = Array.from(projectPanel.querySelectorAll("[data-state]"));
const loadingState = projectPanel.querySelector('[data-state="loading"]');
const retryButton = projectPanel.querySelector("#retry-projects");
const stateLabel = document.querySelector("#current-state-label");
const stateSummary = document.querySelector("#visible-state-summary");
const stateIndex = document.querySelector("#current-state-index");
const statusMessage = document.querySelector("#project-status");
const milestoneId = document.querySelector("#milestone-id");
const introTitleLead = document.querySelector("#intro-title-lead");
const introTitleEmphasis = document.querySelector("#intro-title-emphasis");
const introCopy = document.querySelector("#intro-copy");

const stateContent = {
  loading: {
    label: "Loading state",
    summary: "Preparing your project list",
    index: "01",
    milestone: "T-03A",
    titleLead: "A thoughtful pause",
    titleEmphasis: "before the work appears.",
    description: "A loading skeleton keeps the project list's shape visible while content is on its way. This milestone uses a CSS-only shimmer and reduced-motion support.",
    announcement: "Loading projects.",
  },
  live: {
    label: "Live data state",
    summary: "3 projects loaded",
    index: "02",
    milestone: "T-03B",
    titleLead: "Good work,",
    titleEmphasis: "delivered with clarity.",
    description: "When project data arrives, clear metadata and a responsive card grid make the collection easy to scan on any screen.",
    announcement: "Projects loaded successfully.",
  },
  empty: {
    label: "Empty state",
    summary: "No projects are currently available",
    index: "03",
    milestone: "T-03C",
    titleLead: "A useful answer,",
    titleEmphasis: "even when the list is empty.",
    description: "An empty response is a valid result. A clear message lets people understand what happened without mistaking it for a loading or error state.",
    announcement: "No projects are available.",
  },
  error: {
    label: "Error state",
    summary: "Unable to load projects",
    index: "04",
    milestone: "T-03D",
    titleLead: "Unexpected errors,",
    titleEmphasis: "clear next steps.",
    description: "When something goes wrong, explain what happened and make the next action obvious. The native Retry button works with a pointer, Enter, and Space.",
    announcement: "Projects could not be loaded.",
  },
};

let activeState = null;

function showProjectState(requestedState) {
  const nextState = Object.prototype.hasOwnProperty.call(stateContent, requestedState)
    ? requestedState
    : "error";
  const previousState = activeState;
  const content = stateContent[nextState];

  projectPanel.setAttribute("aria-busy", "true");

  stateElements.forEach((stateElement) => {
    const isActive = stateElement.dataset.state === nextState;

    stateElement.hidden = !isActive;

    if (stateElement.dataset.state === "loading") {
      stateElement.setAttribute("aria-busy", String(isActive));
    }
  });

  stateLabel.textContent = content.label;
  stateSummary.textContent = content.summary;
  stateIndex.textContent = content.index;
  milestoneId.textContent = content.milestone;
  introTitleLead.textContent = content.titleLead;
  introTitleEmphasis.textContent = content.titleEmphasis;
  introCopy.textContent = content.description;
  statusMessage.textContent = content.announcement;

  projectPanel.setAttribute("aria-busy", "false");
  activeState = nextState;

  if (previousState === "error" && nextState === "loading") {
    loadingState.focus();
  }

  return nextState;
}

retryButton.addEventListener("click", () => {
  showProjectState("loading");
});

window.showProjectState = showProjectState;

const previewState = new URLSearchParams(window.location.search).get("state");
const initialState = Object.prototype.hasOwnProperty.call(stateContent, previewState)
  ? previewState
  : "loading";

showProjectState(initialState);
