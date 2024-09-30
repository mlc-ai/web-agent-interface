import { IPageHandler } from "../interface";
import { google } from "googleapis";
import { GoogleCalendarParams } from "./googleCalendar_base";
import { runViewEvents } from "./commands/run_view_events";

export class PageHandler implements IPageHandler {
    protected clientEmail: string;
    protected privateKey: string;
    protected scopes: string[];

    constructor(fields: GoogleCalendarParams) {
        this.clientEmail = fields.credentials?.clientEmail || "";
        this.privateKey = fields.credentials?.privateKey || "";
        this.scopes = fields.scopes || [
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
        ];
    }

    public getAuth = async () => {
        const auth = new google.auth.JWT(
          this.clientEmail,
          undefined,
          this.privateKey,
          this.scopes
        );
        return auth;
    }

    public googleCalendarGetIDsImpl = async () => {
        const auth = await this.getAuth();
        const calendar = google.calendar({ version: "v3", auth });
        const calendarList = await calendar.calendarList.list();
        const calendarIds = calendarList.data.items?.map((item) => item.id);
        return calendarIds;
    }

    public googleCalendarViewEventsImpl = async (calendarId : string) => {
        const auth = await this.getAuth();
        return runViewEvents(
          {
            auth,
            calendarId: calendarId,
          }
        );
    }

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
      description:
        "A tool for retrieving Google Calendar IDs.",
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
      description:
        "A tool for retrieving Google Calendar events and meetings.",
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

export type ToolName = keyof typeof tools;

export function getToolInfo(): { name: ToolName; displayName: string }[] {
  return Object.entries(tools).map(([name, tool]) => ({
    name: name as ToolName,
    displayName: tool.displayName,
  }));
}