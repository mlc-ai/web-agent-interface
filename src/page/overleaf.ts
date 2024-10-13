import { IPageHandler } from "./interface";
import { ToolName } from "../tool";

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
          fragment.appendChild(document.createTextNode(text)),
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
      throw new Error(`Tool '${toolName}' is not available on this page.`);
    }
  }

  toolImplementations: Record<ToolName, (...args: any[]) => any> = {
    getSelectedText: this.getSelectionImpl,
    replaceSelectedText: this.replaceSelectionImpl,
    appendTextToDocument: this.appendTextImpl,
  };
}

export const availableTools: ToolName[] = [
  "getSelectedText",
  "replaceSelectedText",
  "appendTextToDocument",
];
