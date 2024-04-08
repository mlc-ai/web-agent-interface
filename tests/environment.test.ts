import { DOMTreeEnvironment } from "../src/environment/index";
import { ActionType } from "../src/action/index";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

describe("ChatCompletionAction", () => {
  let env: DOMTreeEnvironment;

  beforeEach(() => {
    env = new DOMTreeEnvironment();
  });

  test("test register action", async () => {
    // This will override the default implementation of GET_SELECTED_TEXT
    env.registerAction(ActionType.GetSelectedText, () => "test action");
    const result = await env.executeAction(ActionType.GetSelectedText);
    expect(result).toBe("test action");
  });
});
