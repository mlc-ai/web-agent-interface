import { IPageHandler } from "../interface";
import { google } from "googleapis";

export class PageHandler implements IPageHandler {
  protected token: string;

  // assume that access_token for oAuth2Client is provided when page is initialized
  constructor(token: string) {
    this.token = token;
  }

  public googleCalendarGetIDsImpl = async () => {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: this.token });
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const calendarList = await calendar.calendarList.list();
    const calendarIds = calendarList.data.items?.map((item) => item.id);
    return calendarIds;
  };

  public googleCalendarViewEventsImpl = async (
    calendarId: string = "primary",
    maxResults: number = 10,
  ) => {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: this.token });
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    try {
      const response = await calendar.events.list({
        calendarId: calendarId,
        timeMin: new Date().toISOString(), // Get events from now
        maxResults: maxResults, // Limit to the last #maxResults events
        singleEvents: true, // Expand recurring events into single instances
        orderBy: "startTime", // Order events by start time
      });
      return response.data.items;
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      throw new Error("Failed to fetch calendar events");
    }
  };

  public handleToolCall(toolName: string, params: any): any {
    if (toolName in this.toolImplementations) {
      const toolImplementation = this.toolImplementations[toolName as ToolName];
      return toolImplementation(params);
    } else {
      throw new Error(`Tool '${toolName}' not found in handler.`);
    }
  }

  toolImplementations: Record<ToolName, (...args: any[]) => any> = {
    googleCalendarGetIDs: this.googleCalendarGetIDsImpl,
    googleCalendarViewEvents: this.googleCalendarViewEventsImpl,
  };
}

export const tools = {
  googleCalendarGetIDs: {
    displayName: "Google Calendar Get IDs",
    description: "A tool for retrieving Google Calendar IDs.",
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
    displayName: "Google Calendar View Events",
    description: "A tool for retrieving Google Calendar events and meetings.",
    schema: {
      type: "function",
      function: {
        name: "googleCalendarViewEvents",
        description:
          "googleCalendarViewEvents() -> str - Get the user's Google Calendar events and meetings, parameter is the calendar ID.\\n\\n Args:\\n    calendarId (str): The calendar ID; maxResults (int): the maximum number of results\\n\\n Returns:\\n    title, start time, end time, attendees, description (if available)",
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

export type ToolName = keyof typeof tools;

export function getToolInfo(): { name: ToolName; displayName: string }[] {
  return Object.entries(tools).map(([name, tool]) => ({
    name: name as ToolName,
    displayName: tool.displayName,
  }));
}
