import { CallerType, Scope, ToolType } from "./enum";
import { State } from "./state";
import { Tool } from "./tool";

export const replaceSelectedText = (
  state: State,
  parameters: { newText: string | string[] },
): void => {
  const { newText } = parameters;
  const selection = state.currentSelection;
  if (!newText || !selection) {
    return;
  }
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    if (Array.isArray(newText)) {
      const fragment = document.createDocumentFragment();
      newText.forEach((text) =>
        fragment.appendChild(document.createTextNode(text)),
      );
      range.insertNode(fragment);
    } else {
      range.insertNode(document.createTextNode(newText));
    }
    selection.removeAllRanges();
  }
};

export const appendTextToDocument = (
  state: State,
  parameters: { text: string },
): void => {
  if (window.location.hostname.includes("overleaf.com")) {
    const { text } = parameters;
    const editorElement = document.querySelector(".cm-content");
    if (editorElement) {
      const textNode = document.createTextNode(text);
      editorElement.appendChild(textNode);

      // Scroll to bottom
      const scroller = document.querySelector(".cm-scroller");
      if (scroller) {
        scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
      }
    }
  } else {
    throw new Error("Not Implemented");
  }
};

export async function createGoogleCalendarEvent(
  state: State,
  parameters: {
    token?: string;
    summary: string;
    location?: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    timeZone?: string;
  },
) {
  let { token } = parameters;

  if (!token) {
    // try to get token by using Chrome Identity API
    console.log("`token` not specified, trying retrieving through Google identity API OAuth flow...")
    try {
      const authResult = await chrome.identity.getAuthToken({
        interactive: true,
        scopes: ["https://www.googleapis.com/auth/calendar.events"],
      });
      token = authResult.token;
    } catch (e) {
      throw new Error(
        "createGoogleCalendarEvent: `token` must be specified in parameters or `identity` permission must be added to the extension manifest.\n" +
          e,
      );
    }
  }

  try {
    const timeZone =
      parameters.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Define the event payload (this structure follows Google Calendar API requirements)
    const event = {
      summary: parameters.summary,
      location: parameters.location || "",
      description: parameters.description || "",
      start: {
        dateTime: parameters.startDateTime,
        timeZone,
      },
      end: {
        dateTime: parameters.endDateTime,
        timeZone,
      },
    };

    // Make a POST request to insert the event
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create calendar event");
    }

    const newEvent = await response.json();
    console.log("Event created:", newEvent);

    return { status: "success", event: newEvent };
  } catch (error) {
    console.error("Error creating calendar event:", error);
  }
}

export const actions: Record<string, Tool> = {
  replaceSelectedText: {
    name: "replaceSelectedText",
    displayName: "Replace Selected Text",
    description:
      "Replace the user's current selected text content on the document with new text content.",
    schema: {
      type: "function",
      function: {
        name: "replaceSelectedText",
        description:
          "replaceSelectedText(newText: str) - Replace the user's current selected text content on the document with new text content.\\n\\n Args:\\n    newText (str): New text content to replace the user's current selected text content.",
        parameters: {
          type: "object",
          properties: {
            newText: { type: "string" },
          },
          required: ["newText"],
        },
      },
    },
    type: ToolType.Action,
    scope: [Scope.Overleaf],
    caller: CallerType.ContentScript,
    implementation: replaceSelectedText,
  },
  appendTextToDocument: {
    name: "appendTextToDocument",
    displayName: "Append Text To Document",
    description: "Append text content to the end of the document.",
    schema: {
      type: "function",
      function: {
        name: "appendTextToDocument",
        description:
          "appendTextToDocument(text: str) - Add some text content to the end of the document.\\n\\n Args:\\n    text (str): Text content to be added to the end of the document.",
        parameters: {
          type: "object",
          properties: {
            text: { type: "string" },
          },
          required: ["text"],
        },
      },
    },
    type: ToolType.Action,
    scope: [Scope.Overleaf],
    caller: CallerType.ContentScript,
    implementation: appendTextToDocument,
  },
  createGoogleCalendarEvent: {
    name: "createGoogleCalendarEvent",
    displayName: "Create Google Calendar Event",
    description: "Create a new event in the user's primary Google Calendar.",
    schema: {
      type: "function",
      function: {
        name: "createGoogleCalendarEvent",
        description:
          "createGoogleCalendarEvent(summary: string, startDateTime: string, endDateTime: string, location?: string, description?: string, timeZone?: string) - Creates a new event in the user's Google Calendar.\n\n Args:\n    summary (str): Title of the event.\n    startDateTime (str): Start date and time of the event (ISO 8601 format).\n    endDateTime (str): End date and time of the event (ISO 8601 format).\n    location (str, optional): Location of the event.\n    description (str, optional): Description of the event.\n    timeZone (str, optional): The timezone of the event.",
        parameters: {
          type: "object",
          properties: {
            summary: { type: "string" },
            location: { type: "string", nullable: true },
            description: { type: "string", nullable: true },
            startDateTime: { type: "string" },
            endDateTime: { type: "string" },
            timeZone: { type: "string", nullable: true },
          },
          required: ["summary", "startDateTime", "endDateTime"],
        },
      },
    },
    type: ToolType.Action,
    scope: Scope.Any,
    caller: CallerType.Any,
    implementation: createGoogleCalendarEvent,
  },
};
