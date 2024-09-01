/**
 * Implementation of getTextSelection, replaceSelectedText, etc for Overleaf
 * @class OverleafPage
 */
class PageHandler {
  currentSelection = null;

  constructor() {
    // Listen for the selection change event
    document.addEventListener("selectionchange", this.handleSelectionChange);
  }

  handleSelectionChange = () => {
    const selection = window.getSelection();

    if (
      selection &&
      typeof selection.rangeCount !== "undefined" &&
      selection.rangeCount > 0
    ) {
      this.currentSelection = selection;
    }
  };

  getSelectionImpl = () => {
    if (!this.currentSelection) {
      return "";
    }
    const selectedText = this.currentSelection.toString();
    return selectedText;
  };

  replaceSelectionImpl = (params) => {
    const newText = params.newText;
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
    } else {
      return;
    }
  };

  appendTextImpl = (params) => {
    const text = params.text;
    const editorElement = document.querySelector(".cm-content");
    if (editorElement) {
      const textNode = document.createTextNode(text);
      editorElement.appendChild(textNode);
    }
  };

  handleToolCall = (toolName, params) => {
    const toolImplementation = this.toolNameToImplementation[actionName];
    if (action) {
      const response = toolImplementation(params);
      return response;
    } else {
      console.warn(`Tool '${toolName}' not found.`);
    }
  };

  toolNameToImplementation = {
    getSelection: this.getSelectionImpl,
    replaceSelection: this.replaceSelectionImpl,
    appendText: this.appendTextImpl,
  };
}
export const nameToDisplayName = {
  getSelection: "Get Selected Text",
  replaceSelection: "Replace Selected Text",
  appendText: "Add Text to Document",
};
export const tools = Object.keys(nameToDisplayName);
export const initHandler = () => new PageHandler();
