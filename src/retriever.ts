import * as Overleaf from "./overleaf/retriever";
import { CallerType, Scope, ToolType } from "./enum";
import { Tool } from "./tool";
import { isOverleafDocument } from "./util";

export * as Overleaf from "./overleaf/retriever";

export const getSelectedText = (parameters: {}): string => {
  const selection = window.getSelection();
  if (!selection) {
    return "";
  }
  return selection.toString();
};

export const getPageContext = (): string => {
  const pageTitle = document.title;
  const metaDescription = document.querySelector("meta[name='description']");
  const pageDescription = metaDescription ? metaDescription.getAttribute("content") : "No description available";

  let context: any = {
    "url": window.location.href,
    "title": pageTitle, 
    "description": pageDescription,
  }
  if (isOverleafDocument()) { 
    context = {
      ...context,
      ...Overleaf.getEditorContext()
    }
  }
  if (document) {
    context = {
      ...context,
      content: document.body.innerText || "",
    }
  }
  return JSON.stringify(context);
};

export async function getCalendarEvents(parameters: { token?: string }) {
  let { token } = parameters;

  if (!token) {
    // try to get token by using Chrome Identity API
    try {
      const authResult = await chrome.identity.getAuthToken({
        interactive: true,
        scopes: ["https://www.googleapis.com/auth/calendar.events.readonly"],
      });
      token = authResult.token;
    } catch (e) {
      throw new Error(
        "getCalendarEvents: `token` must be specified in parameters or `identity` permission must be added to the extension manifest.\n" +
          e
      );
    }
  }

  try {
    // API URL to fetch calendar events
    const url =
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true";

    // Fetch the events from the user's primary Google Calendar
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch calendar events");
    }

    const events = await response.json();

    // Process and display events in popup (this is a basic example)
    if (events.items) {
      events.items.forEach((event: any) => {
        const eventElement = document.createElement("div");
        eventElement.textContent = `${event.summary} - ${event.start.dateTime || event.start.date}`;
        document.body.appendChild(eventElement);
      });
    } else {
      document.body.textContent = "No upcoming events found.";
    }
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    document.body.textContent = "Error fetching events";
  }
}

export const retrievers: Record<string, Tool> = {
  getSelectedText: {
    name: "getSelectedText",
    displayName: "Get Selected Text",
    description:
      "Get the user's current selected text content on the document.",
    schema: {
      type: "function",
      function: {
        name: "getSelectedText",
        description:
          "getSelectedText() -> str - Get the user's current selected text content on the document, no parameter is needed.\\n\\n Returns:\\n    str: The user's current selected text content on the document.",
        parameters: { type: "object", properties: {}, required: [] },
      },
    },
    type: ToolType.Retriever,
    scope: Scope.Any,
    caller: CallerType.Any,
    implementation: getSelectedText,
  },
  getPageContext: {
    name: "getPageContext",
    displayName: "Get Page Context",
    description: "Get context information regarding the current page which the user is currently viewing.",
    schema: {
      type: "function",
      function: {
        name: "getPageContext",
        description:
          "getPageContext() -> str - Get context information regarding the current page which the user is currently viewing.\n\n Returns:\n    str: The entire text content of the webpage.",
        parameters: { type: "object", properties: {}, required: [] },
      },
    },
    type: ToolType.Retriever,
    scope: Scope.Any,
    caller: CallerType.ContentScript,
    implementation: getPageContext,
  },
  getGoogleCalendarEvents: {
    name: "getGoogleCalendarEvents",
    displayName: "Get Google Calendar Events",
    description:
      "Fetch the user's upcoming events from their primary Google Calendar.",
    schema: {
      type: "function",
      function: {
        name: "getGoogleCalendarEvents",
        description:
          "getGoogleCalendarEvents(token: string) - Fetches up to 10 upcoming events from the user's Google Calendar.\n\n Returns:\n    Array: List of upcoming events with event details.",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    },
    type: ToolType.Retriever,
    scope: Scope.Any,
    caller: CallerType.Any,
    implementation: getCalendarEvents,
  },
};
