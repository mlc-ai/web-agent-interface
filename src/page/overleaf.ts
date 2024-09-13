/**
 * Implementation of getTextSelection, replaceSelectedText, etc for Overleaf
 * @class OverleafPage
 */
class PageHandler {
  public currentSelection: Selection | null = null;

  constructor() {
    // Listen for the selection change event
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

  handleToolCall = (toolName: string, params: any): any => {
    if (toolName in this.toolNameToImplementation) {
      const toolImplementation = this.toolNameToImplementation[toolName];
      return toolImplementation(params);
    } else {
      console.warn(`Tool '${toolName}' not found in handler.`);
    }
  };

  toolNameToImplementation: Record<string, (params: any) => any> = {
    getSelection: this.getSelectionImpl,
    replaceSelection: this.replaceSelectionImpl,
    appendText: this.appendTextImpl,
  };
}

export const nameToDisplayName: Record<string, string> = {
  getSelection: "Get Selected Text",
  replaceSelection: "Replace Selected Text",
  appendText: "Add Text to Document",
};

export const tools: string[] = Object.keys(nameToDisplayName);
export const initHandler = (): PageHandler => new PageHandler();
