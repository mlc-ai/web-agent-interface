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

export async function createCalendarEvent(
  state: State,
  parameters: {
    token: string;
    summary: string;
    location?: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    timeZone?: string;
  },
) {
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
        timeZone, // Adjust this according to the user's time zone
      },
      end: {
        dateTime: parameters.endDateTime,
        timeZone, // Adjust this according to the user's time zone
      },
    };

    // Make a POST request to insert the event
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${parameters.token}`,
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
    implementation: appendTextToDocument,
  },
  createCalendarEvent: {
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
    implementation: createCalendarEvent,
  },
};
