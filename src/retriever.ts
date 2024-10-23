import { CallerType, Scope, ToolType } from "./enum";
import { State } from "./state";
import { Tool } from "./tool";

export const getSelectedText = (state: State, parameters: {}): string => {
  if (!state.currentSelection) {
    return "";
  }
  return state.currentSelection.toString();
};

export async function getCalendarEvents(
  state: State,
  parameters: { token?: string },
) {
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
        Authorization: `Bearer ${parameters.token}`,
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
  getCalendarEvents: {
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
