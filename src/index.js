import * as Overleaf from "./page/overleaf.js";

const PAGE_HANDLER_MAP = {
  "www.overleaf.com": Overleaf,
};

const initHandler = () => {
  if (Object.keys(PAGE_HANDLER_MAP).includes(window.location.hostname)) {
    return PAGE_HANDLER_MAP[window.location.hostname].initHandler();
  }
  console.error("[Web Agent Interface] No handler found for the current page");
};

const getTools = () => {
  if (Object.keys(PAGE_HANDLER_MAP).includes(window.location.hostname)) {
    return PAGE_HANDLER_MAP[window.location.hostname].actions;
  }
  console.error("[Web Agent Interface] No actions found for the current page");
};

const getToolDisplayName = (action) => {
  if (
    Object.keys(PAGE_HANDLER_MAP).includes(window.location.hostname) &&
    PAGE_HANDLER_MAP[window.location.hostname].actions.includes(action)
  ) {
    return PAGE_HANDLER_MAP[window.location.hostname].nameToDisplayName[action];
  }
  console.error("[Web Agent Interface] No actions found for the current page");
};

export { initHandler, getTools, getToolDisplayName };
