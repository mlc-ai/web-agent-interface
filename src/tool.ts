const tools: Record<string, ToolInfo> = {
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
  },
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
