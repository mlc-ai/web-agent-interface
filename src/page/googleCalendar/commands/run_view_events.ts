import { calendar_v3 } from "googleapis";
import type { JWT } from "googleapis-common";

type RunViewEventParams = {
  auth: JWT;
  calendarId: string;
};

const runViewEvents = async ({ auth, calendarId }: RunViewEventParams) => {
  const calendar = new calendar_v3.Calendar({});

  try {
    const response = await calendar.events.list({
      auth,
      calendarId,
    });

    const curatedItems =
      response.data && response.data.items
        ? response.data.items.map(
            ({
              status,
              summary,
              description,
              start,
              end,
            }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
            any) => ({
              status,
              summary,
              description,
              start,
              end,
            }),
          )
        : [];

    return `Result for view events command: \n${JSON.stringify(
      curatedItems,
      null,
      2,
    )}`;
  } catch (error) {
    return `An error occurred: ${error}`;
  }
};

export { runViewEvents };
