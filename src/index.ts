import * as Oveleaf from "./page/overleaf";
import { ToolName } from "./tool";
export { getToolInfo, getToolsInfo, allTools } from "./tool";

const PAGE_HANDLER_MAP: Record<string, typeof Oveleaf.PageHandler> = {
  "www.overleaf.com": Oveleaf.PageHandler,
};

const PAGE_TOOLS_MAP: Record<string, ToolName[]> = {
  "www.overleaf.com": Oveleaf.availableTools,
};

export const isPageSupported = (url: string) => {
  return Object.keys(PAGE_HANDLER_MAP).includes(url);
};

export const isCurrentPageSupported = () => {
  return Object.keys(PAGE_HANDLER_MAP).includes(window.location.hostname);
};

export const initHandler = () => {
  if (isCurrentPageSupported()) {
    return new PAGE_HANDLER_MAP[window.location.hostname]();
  }
  console.error("[Web Agent Interface] No tools found for the current page");
};

export const getAvailableTools = () => {
  if (isCurrentPageSupported()) {
    return PAGE_TOOLS_MAP[window.location.hostname];
  }
  console.error("[Web Agent Interface] No tools found for the current page");
};
