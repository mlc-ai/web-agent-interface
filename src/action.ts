import { CallerType, Scope, ToolType } from "./enum";
import { Tool } from "./tool";
import { isOverleafDocument } from "./util";

import * as Overleaf from "./overleaf/action";

export * as Overleaf from "./overleaf/action";

export const replaceSelectedText = (parameters: {
  newText: string | string[];
}): void => {
  const { newText } = parameters;
  const selection = window.getSelection();
  if (!newText || !selection) {
    return;
  }
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    if (Array.isArray(newText)) {
      const fragment = document.createDocumentFragment();
      newText.forEach((text) =>
        fragment.appendChild(document.createTextNode(text))
      );
      range.insertNode(fragment);
    } else {
      range.insertNode(document.createTextNode(newText));
    }
    selection.removeAllRanges();
  }
};

export const insertText = (parameters: {
  textToInsert: string;
  position: "beginning" | "end" | "cursor";
}): void => {
  if (isOverleafDocument()) {
    return Overleaf.insertText(parameters);
  } else {
    throw new Error("Action is not implemented");
  }
};

export async function createGoogleCalendarEvent(parameters: {
  token?: string;
  summary: string;
  location?: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  timeZone?: string;
}) {
  let { token } = parameters;

  if (!token) {
    // try to get token by using Chrome Identity API
    console.log(
      "`token` not specified, trying retrieving through Google identity API OAuth flow..."
    );
    try {
      const authResult = await chrome.identity.getAuthToken({
        interactive: true,
        scopes: ["https://www.googleapis.com/auth/calendar.events"],
      });
      token = authResult.token;
    } catch (e) {
      throw new Error(
        "createGoogleCalendarEvent: `token` must be specified in parameters or `identity` permission must be added to the extension manifest.\n" +
          e
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
      }
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
  insertText: {
    name: "insertText",
    displayName: "Insert Text",
    description:
      "Insert the specified text at a given position relative to the document: at the beginning, end, or cursor position.",
    schema: {
      type: "function",
      function: {
        name: "insertText",
        description:
          "insertText(parameters: { textToInsert: str, position: 'beginning' | 'end' | 'cursor' }) - Insert text into the document at the specified position.\\n\\n Args:\\n    textToInsert (str): The text content to be inserted.\\n    position ('beginning' | 'end' | 'cursor'): Where to insert the text (beginning of the document, end of the document, or at the cursor position).",
        parameters: {
          type: "object",
          properties: {
            textToInsert: { type: "string" },
            position: {
              type: "string",
              enum: ["beginning", "end", "cursor"],
            },
          },
          required: ["textToInsert", "position"],
        },
      },
    },
    type: ToolType.Action,
    scope: [Scope.Overleaf],
    caller: CallerType.ContentScript,
    implementation: insertText,
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
