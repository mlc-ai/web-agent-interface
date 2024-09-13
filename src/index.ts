import { IPageHandler } from "./page/interface";
import * as Oveleaf from "./page/overleaf";

const PAGE_HANDLER_MAP: Record<string, typeof Oveleaf.PageHandler> = {
  "www.overleaf.com": Oveleaf.PageHandler,
};

const PAGE_TOOLS_MAP: Record<string, typeof Oveleaf.tools> = {
  "www.overleaf.com": Oveleaf.tools,
};

export const initHandler = () => {
  if (Object.keys(PAGE_HANDLER_MAP).includes(window.location.hostname)) {
    return new PAGE_HANDLER_MAP[window.location.hostname]();
  }
  console.error("[Web Agent Interface] No tools found for the current page");
};

const getTools = () => {
  if (Object.keys(PAGE_TOOLS_MAP).includes(window.location.hostname)) {
    return PAGE_TOOLS_MAP[window.location.hostname];
  }
  console.error("[Web Agent Interface] No tools found for the current page");
};