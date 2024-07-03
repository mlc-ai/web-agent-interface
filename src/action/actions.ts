import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionRequest,
  ChatOptions,
  InitProgressCallback,
} from "@mlc-ai/web-llm";

import { ChatBox } from "../environment";

// Define the Action type
export enum ActionType {
  // Low-level actions
  Click,
  Type,
  Navigate,
  Scroll,

  // High-level actions
  GetSelectedText,
  ReplaceSelectedText,
  HighlightSelectedText,
  RemoveAllHighlights,
  ReplaceHighlightedText,

  // Chat-related actions
  InitChat,
  ChatCompletion,
  CreateChatBox,
}

// Define specific function signatures for each action

/**
 * Click on an element in the active tab
 *
 * @param selector The CSS selector of the element to click on
 * @returns Whether the click was successful
 */
export type ClickAction = (selector: string) => boolean;

/**
 * Type text into an input element in the active tab
 *
 * @param selector The CSS selector of the input element to type into
 * @param text The text to type
 * @returns Whether the typing was successful
 */
export type TypeAction = (selector: string, text: string) => boolean;

/**
 * Navigate to a URL in the active tab
 *
 * @param url The URL to navigate to
 * @returns Whether the navigation was successful
 */
export type NavigateAction = (url: string, openInNewTab?: boolean) => void;

/**
 * Scroll the active tab
 *
 * @param x The horizontal scroll amount
 * @param y The vertical scroll amount
 * @returns Whether the scroll was successful
 */
export type ScrollAction = (x: number, y: number) => void;

/**
 * Get the currently selected text in the active tab
 *
 * @param selector The CSS selector of the element to get the selected text from
 * @returns The selected text
 */
export type GetSelectedTextAction = (selector?: string) => string | null;

/**
 * Replace the currently selected text in the active tab
 *
 * @param selector The CSS selector of the element to replace the selected text in
 * @param replace_text The text to replace the selected text with
 * @returns Whether the replacement was successful
 */
export type ReplaceSelectedTextAction = (
  replace_text: string,
  selector?: string,
) => boolean;

export type HighlightSelectedTextAction = () => void;

export type RemoveAllHighlightsAction = () => void;

export type ReplaceHighlightedTextAction = (replace_text: string) => void;

/**
 * Initialize a chat session with the model
 *
 * @param modelId The ID of the model to chat with
 * @param chatOpts The web-llm chat options
 */
export type InitChatAction = (
  worker: Worker,
  modelId: string,
  chatOpts?: ChatOptions,
  initProgressCallback?: InitProgressCallback,
) => Promise<void>;

/**
 * Completes a single ChatCompletionRequest
 *
 * @param request A OpenAI-style ChatCompletion request
 */
export type ChatCompletionAction = (
  request: ChatCompletionRequest,
) => Promise<ChatCompletion | AsyncIterable<ChatCompletionChunk>>;

export type CreateChatBoxAction = (
  selector: string,
  onSubmitCallback: (inputValue: string, chatBox: ChatBox) => void,
  onAcceptCallback: (generatedOutput: string, chatBox: ChatBox) => void,
  onDiscardCallback: (chatBox: ChatBox) => void,
) => ChatBox;

// Map each ActionType to its corresponding function signature
export type ActionFunctionMap = {
  [ActionType.Click]: ClickAction;
  [ActionType.Type]: TypeAction;
  [ActionType.Navigate]: NavigateAction;
  [ActionType.Scroll]: ScrollAction;

  [ActionType.GetSelectedText]: GetSelectedTextAction;
  [ActionType.ReplaceSelectedText]: ReplaceSelectedTextAction;
  [ActionType.HighlightSelectedText]: HighlightSelectedTextAction;
  [ActionType.RemoveAllHighlights]: RemoveAllHighlightsAction;
  [ActionType.ReplaceHighlightedText]: ReplaceHighlightedTextAction;

  [ActionType.InitChat]: InitChatAction;
  [ActionType.ChatCompletion]: ChatCompletionAction;
  [ActionType.CreateChatBox]: CreateChatBoxAction;
};
