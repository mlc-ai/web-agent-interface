import { State } from "./state";

export const replaceSelectedText = (
  state: State,
  parameters: { newText: string | string[] },
): void => {
  const { newText } = parameters;
  const selection = state.currentSelection;
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

export const appendTextToDocument = (
  state: State,
  parameters: { text: string },
): void => {
  if (window.location.hostname.includes("overleaf.com")) {
    const { text } = parameters;
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
  } else {
    throw new Error("Not Implemented");
  }
};
