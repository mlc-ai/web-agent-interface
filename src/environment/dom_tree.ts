import { Environment, EnvironmentTypeEnum } from "./environment";
import { ActionType } from "../action";
import { ChatBox } from "./chatbox";

export class DOMTreeEnvironment extends Environment {
  metadata?: Record<string, any>;

  constructor(metadata?: Record<string, any>) {
    super(EnvironmentTypeEnum.DomTree);
    this.metadata = metadata;
    this.registerLowLevelActions();
    this.registerTextActions();
    this.registerCreateChatBoxAction();
  }

  private registerLowLevelActions() {
    this.registerClickAction();
    this.registerTypeAction();
    this.registerNavigateAction();
    this.registerScrollAction();
  }

  private registerTextActions() {
    this.registerAction(ActionType.GetSelectedText, (selector?: string) => {
      const element = selector
        ? (document.querySelector(selector) as HTMLElement)
        : document;
      let selectedText = null;
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        const start = element.selectionStart;
        const end = element.selectionEnd;
        if (start !== null && end !== null && start !== end) {
          selectedText = element.value.substring(start, end);
        }
      } else {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (
            element.contains(range.commonAncestorContainer) ||
            element.contains(range.startContainer) ||
            element.contains(range.endContainer)
          ) {
            selectedText = selection.toString();
          }
        }
      }
      return selectedText;
    });

    this.registerAction(
      ActionType.ReplaceSelectedText,
      (replacementText: string, selector?: string) => {
        let replaced = false;
        const element = selector
          ? (document.querySelector(selector) as HTMLElement)
          : document;
        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement
        ) {
          const start = element.selectionStart;
          const end = element.selectionEnd;
          if (start !== null && end !== null && start !== end) {
            element.value =
              element.value.substring(0, start) +
              replacementText +
              element.value.substring(end);
            // Optionally, adjust the cursor position after replacement
            element.selectionStart = element.selectionEnd =
              start + replacementText.length;
            replaced = true;
          }
        } else {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (
              element.contains(range.commonAncestorContainer) ||
              element.contains(range.startContainer) ||
              element.contains(range.endContainer)
            ) {
              range.deleteContents();
              range.insertNode(document.createTextNode(replacementText));
              // Collapse the range to the end point of the insertion to mimic typical user input behavior
              selection.collapseToEnd();
              replaced = true;
            }
          }
        }
        return replaced;
      },
    );
  }

  private registerClickAction() {
    this.registerAction(ActionType.Click, (selector: string) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.click();
        return true;
      }
      return false;
    });
  }

  private registerTypeAction() {
    this.registerAction(ActionType.Type, (selector: string, text: string) => {
      const element = document.querySelector(selector);
      if (
        (element && element instanceof HTMLInputElement) ||
        element instanceof HTMLTextAreaElement
      ) {
        element.value = text;
        return true;
      }
      return false;
    });
  }

  private registerNavigateAction() {
    this.registerAction(
      ActionType.Navigate,
      (url: string, openInNewTab?: boolean) => {
        if (openInNewTab) {
          window.open(url, "_blank")?.focus();
        } else {
          window.location.href = url;
        }
      },
    );
  }

  private registerScrollAction() {
    this.registerAction(ActionType.Scroll, (x: number, y: number) => {
      window.scrollBy(x, y);
    });
  }

  private registerCreateChatBoxAction() {
    this.registerAction(
      ActionType.CreateChatBox,
      (selector, submitCallback, acceptCallback, discardCallback) => {
        return new ChatBox(selector, submitCallback, acceptCallback, discardCallback);
      },
    );
  }
}
