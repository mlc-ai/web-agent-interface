import { Environment, EnvironmentTypeEnum } from "./environment";
import { ActionType } from "../action";
import { ChatBox } from "./chatbox";

import rangy from "rangy";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-classapplier";

export class DOMTreeEnvironment extends Environment {
  metadata?: Record<string, any>;
  highlighter?: any;

  constructor(metadata?: Record<string, any>) {
    super(EnvironmentTypeEnum.DomTree);
    this.metadata = metadata;
    this.registerLowLevelActions();
    this.registerTextActions();
    this.registerCreateChatBoxAction();
    rangy.init();
    this.highlighter = rangy.createHighlighter();
    this.highlighter.addClassApplier(
      rangy.createClassApplier("wai-highlight", {
        ignoreWhiteSpace: true,
        tagNames: ["span"],
      }),
    );
    const styleSheet = document.createElement("style");
    styleSheet.innerText = ".wai-highlight { background: lightgrey; }";
    document.head.appendChild(styleSheet);
  }

  private registerLowLevelActions() {
    this.registerClickAction();
    this.registerTypeAction();
    this.registerNavigateAction();
    this.registerScrollAction();
  }

  private registerTextActions() {
    this.registerAction(ActionType.GetSelectedText, (selector?: string) => {
      return rangy.getSelection().toString();
    });

    this.registerAction(
      ActionType.ReplaceSelectedText,
      (replacementText: string, selector?: string) => {
        const sel = rangy.getSelection();
        if (sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(replacementText));
          return true;
        }
        return false;
      },
    );

    this.registerAction(ActionType.HighlightSelectedText, () => {
      const sel = rangy.getSelection();
      if (sel.rangeCount > 0) {
        this.highlighter.highlightSelection("wai-highlight");
      }
    });

    this.registerAction(ActionType.RemoveAllHighlights, () => {
      this.highlighter.removeAllHighlights();
      // Ensure that we don't have any remaining highlighted elements
      const highlightedElements: NodeListOf<HTMLElement> =
        document.querySelectorAll(".wai-highlight");
      highlightedElements.forEach((element) => {
        const docFragment: DocumentFragment = document.createDocumentFragment();
        while (element.firstChild) {
          docFragment.appendChild(element.firstChild);
        }
        element.parentNode?.replaceChild(docFragment, element);
      });
    });

    this.registerAction(
      ActionType.ReplaceHighlightedText,
      (replacementText: string) => {
        const highlightedElements: NodeListOf<HTMLElement> =
          document.querySelectorAll(".wai-highlight");
        highlightedElements.forEach((element) => {
          element.innerText = replacementText;
        });
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
        return new ChatBox(
          selector,
          submitCallback,
          acceptCallback,
          discardCallback,
        );
      },
    );
  }
}
