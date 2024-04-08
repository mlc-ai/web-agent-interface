import { chatBoxTemplate } from "./assets";
// @ts-ignore
import * as rangy from 'rangy'
// @ts-ignore
import 'rangy/lib/rangy-classapplier'
import 'rangy/lib/rangy-highlighter'
import 'rangy/lib/rangy-selectionsaverestore'

export class ChatBox extends HTMLElement {
  chatBox: HTMLElement;

  chatInput?: HTMLInputElement;
  chatOutput?: HTMLDivElement;
  onSubmit: (textInput: string, chatBox: ChatBox) => void;
  onAccept: (generatedOutput: string, chatBox: ChatBox) => void;
  onDiscard: (chatBox: ChatBox) => void;

  highlighter?: any;

  constructor(
    selector: string,
    submitCallback: (textInput: string, chatBox: ChatBox) => void,
    acceptCallback: (generatedOutput: string, chatBox: ChatBox) => void,
    discardCallback: (chatBox: ChatBox) => void
  ) {
    super();
    this.onSubmit = submitCallback;
    this.onAccept = acceptCallback;
    this.onDiscard = discardCallback;
    this.attachShadow({ mode: "open" });

    this.initDisplay(selector);
    this.chatBox = this.shadowRoot?.querySelector(
      ".chatbox-container"
    ) as HTMLElement;
    this.hide();
    rangy.init();

  }

  initDisplay(selector: string) {
    if (!this.shadowRoot) return;
    this.shadowRoot.appendChild(chatBoxTemplate.content.cloneNode(true));

    this.chatInput = this.shadowRoot.querySelector(
      "#chat-input"
    ) as HTMLInputElement;
    this.chatOutput = this.shadowRoot.querySelector(
      ".chat-output"
    ) as HTMLDivElement;

    const submitButton = this.shadowRoot.querySelector(
      "#chat-submit"
    ) as HTMLButtonElement;
    const acceptButton = this.shadowRoot.querySelector(
      "#chat-accept"
    ) as HTMLButtonElement;
    const discardButton = this.shadowRoot.querySelector(
      "#chat-discard"
    ) as HTMLButtonElement;

    this.chatInput.addEventListener("keydown", (event: KeyboardEvent) => {
      // Check if Enter was pressed and the input field is not empty or just whitespace
      if (event.key === "Enter") {
        event.preventDefault();
        this.handleSubmit();
      }
    });

    submitButton.addEventListener("click", () => {
      this.handleSubmit();
    });
    acceptButton.addEventListener("click", () => {
      if (this.chatOutput) {
        this.onAccept(this.chatOutput.innerText, this);
      }
    });
    discardButton.addEventListener("click", () => {
      this.onDiscard(this);
    });

    this.highlighter = rangy.createHighlighter();
    this.highlighter.addClassApplier(rangy.createClassApplier("wai-highlight", {
        ignoreWhiteSpace: true,
        tagNames: ["span"],
    }));

    // Insert the element to the selector if it's not already there
    if (!this.isConnected) {
      const element = document.querySelector(selector) as HTMLElement;
      if (!element) {
        throw new Error(`Element with selector ${selector} not found`);
      }
      element.appendChild(this);
      const styleSheet = document.createElement('style');
      styleSheet.innerText = '.wai-highlight { background: lightgrey; }';
      document.head.appendChild(styleSheet);

      element.addEventListener("focus", () => {
        this.highlighter.removeAllHighlights();
      });
    }
  }

  private handleSubmit() {
    if (this.chatInput && this.chatInput.value.trim()) {
      this.onSubmit(this.chatInput.value, this);
    }
  }

  /**
   * Display the chat box under the selected text
   */
  displayUnderSelectedText(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.highlighter.highlightSelection("wai-highlight");
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Calculate position and show the chat box
      this.chatBox.style.position = "absolute";
      this.chatBox.style.left = `${rect.left + window.scrollX}px`;
      this.chatBox.style.top = `${rect.bottom + window.scrollY + 5}px`;
      this.chatBox.style.maxWidth = "400px";
      this.chatBox.style.width = "50%";
      this.chatBox.style.display = "block";
      this.show();
    }
  }

  hide(): void {
    this.chatBox.style.display = "none";
    this.highlighter.removeAllHighlights();
  }

  show(): void {
    this.chatBox.style.display = "flex";
    this.chatInput?.focus();
  }

  setOutputText(text: string): void {
    if (this.chatOutput) {
      this.chatOutput.innerText = text;
    }
  }
}

customElements.define("wai-chat-box", ChatBox);
