import { IPageHandler } from "./interface";

/**
 * Implementation of getTextSelection, replaceSelectedText, etc for Overleaf
 * @class OverleafPage
 */
export class PageHandler implements IPageHandler {
  public currentSelection: Selection | null = null;

  constructor() {
    document.addEventListener("selectionchange", this.handleSelectionChange);
  }

  public handleSelectionChange = (): void => {
    const selection = window.getSelection();

    if (
      selection &&
      typeof selection.rangeCount !== "undefined" &&
      selection.rangeCount > 0
    ) {
      this.currentSelection = selection;
    }
  };

  public getSelectionImpl = (): string => {
    if (!this.currentSelection) {
      return "";
    }
    return this.currentSelection.toString();
  };

  public replaceSelectionImpl = (params: {
    newText: string | string[];
  }): void => {
    const { newText } = params;
    const selection = this.currentSelection;
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

  public appendTextImpl = (params: { text: string }): void => {
    const { text } = params;
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
  };

  public handleToolCall(toolName: string, params: any): any {
    if (toolName in this.toolImplementations) {
      const toolImplementation = this.toolImplementations[toolName as ToolName];
      return toolImplementation(params);
    } else {
      console.warn(`Tool '${toolName}' not found in handler.`);
    }
  }

  toolImplementations: Record<ToolName, (...args: any[]) => any> = {
    getSelection: this.getSelectionImpl,
    replaceSelection: this.replaceSelectionImpl,
    appendText: this.appendTextImpl,
  };
}

export const tools = {
  getSelection: {
    displayName: "Get Selected Text",
  },
  replaceSelection: {
    displayName: "Replace Selected Text",
  },
  appendText: {
    displayName: "Append New Text",
  },
};

export type ToolName = keyof typeof tools;

export function getToolInfo(): { name: ToolName; displayName: string }[] {
  return Object.entries(tools).map(([name, tool]) => ({
    name: name as ToolName,
    displayName: tool.displayName,
  }));
}
