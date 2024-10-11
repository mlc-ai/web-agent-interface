const tools: Record<string, ToolInfo> = {
  getSelection: {
    name: "getSelection",
    displayName: "Get Selected Text",
    description:
      "Get the user's current selected text content on the document.",
    schema: {
      type: "function",
      function: {
        name: "getSelection",
        description:
          "getSelection() -> str - Get the user's current selected text content on the document, no parameter is needed.\\n\\n Returns:\\n    str: The user's current selected text content on the document.",
        parameters: { type: "object", properties: {}, required: [] },
      },
    },
  },
  replaceSelection: {
    name: "replaceSelection",
    displayName: "Replace Selected Text",
    description:
      "Replace the user's current selected text content on the document with new text content.",
    schema: {
      type: "function",
      function: {
        name: "replaceSelection",
        description:
          "replaceSelection(newText: str) - Replace the user's current selected text content on the document with new text content.\\n\\n Args:\\n    newText (str): New text content to replace the user's current selected text content.",
        parameters: {
          type: "object",
          properties: {
            newText: { type: "string" },
          },
          required: ["newText"],
        },
      },
    },
  },
  appendText: {
    name: "appendText",
    displayName: "Append New Text",
    description: "Add some text content to the end of the document.",
    schema: {
      type: "function",
      function: {
        name: "appendText",
        description:
          "appendText(text: str) - Add some text content to the end of the document.\\n\\n Args:\\n    text (str): Text content to be added to the end of the document.",
        parameters: {
          type: "object",
          properties: {
            text: { type: "string" },
          },
          required: ["text"],
        },
      },
    },
  },
  googleCalendarGetIDs: {
    name: "googleCalendarGetIDs",
    displayName: "Google Calendar - Get IDs",
    description: "Retrieve Google Calendar IDs.",
    schema: {
      type: "function",
      function: {
        name: "googleCalendarGetIDs",
        description:
          "googleCalendarGetIDs() -> str - Get user's Google Calendar IDs, no parameter is needed.\\n\\n Returns:\\n    calendar IDs",
        parameters: { type: "object", properties: {}, required: [] },
      },
    },
  },
  googleCalendarViewEvents: {
    name: "googleCalendarViewEvents",
    displayName: "Google Calendar - View Events",
    description: "Retrieve Google Calendar events and meetings.",
    schema: {
      type: "function",
      function: {
        name: "googleCalendarViewEvents",
        description:
          "googleCalendarViewEvents() -> str - Get the user's Google Calendar events and meetings, parameter is the calendar ID.\\n\\n Args:\\n    calendarId (str): The calendar ID.\\n\\n Returns:\\n    title, start time, end time, attendees, description (if available)",
        parameters: {
          type: "object",
          properties: {
            calendarId: { type: "string" },
          },
          required: ["calendarId"],
        },
      },
    },
  },
};

export const allTools = Object.keys(tools);

export type ToolName = keyof typeof tools;

export interface ToolInfo {
  name: ToolName;
  displayName: string;
  description: string;
  schema: any;
}

export function getToolsInfo(): Record<string, ToolInfo> {
  return tools;
}

export function getToolInfo(name: ToolName): ToolInfo {
  return tools[name];
}
