import * as Overleaf from "./page/overleaf.js";

const PAGE_HANDLER_MAP = {
  "www.overleaf.com": Overleaf,
};

const initHandler = () => {
  if (Object.keys(PAGE_HANDLER_MAP).includes(window.location.hostname)) {
    return PAGE_HANDLER_MAP[window.location.hostname].initHandler();
  }
  console.error("[Web Agent Interface] No tools found for the current page");
};

const getTools = () => {
  if (Object.keys(PAGE_HANDLER_MAP).includes(window.location.hostname)) {
    return PAGE_HANDLER_MAP[window.location.hostname].tools;
  }
  console.error("[Web Agent Interface] No tools found for the current page");
};

const getToolDisplayName = (tool) => {
  if (
    Object.keys(PAGE_HANDLER_MAP).includes(window.location.hostname) &&
    PAGE_HANDLER_MAP[window.location.hostname].tools.includes(tool)
  ) {
    return PAGE_HANDLER_MAP[window.location.hostname].nameToDisplayName[tool];
  }
  console.error("[Web Agent Interface] No tools found for the current page");
};

export { initHandler, getTools, getToolDisplayName, Overleaf };
