import { Ability, AbilityTypeEnum, UITrigger } from "./ability";
import { ActionType } from "../action";
import {
  ChatCompletionChunk,
  ChatCompletionRequest,
  ChatOptions,
  InitProgressCallback,
  MLCEngineConfig,
} from "@mlc-ai/web-llm";
import { ChatBox } from "../environment";
import rangy from "rangy";

export interface EditingAbilityConfig {
  // Triggering conditions
  uiTriggers: UITrigger[];

  // Chat related configs
  worker: Worker;
  modelId: string;
  engineConfig?: MLCEngineConfig;
  chatOptions?: ChatOptions;
}

export class EditingAbility extends Ability {
  config: EditingAbilityConfig;
  chatBox?: ChatBox;
  selector?: string;
  selectedText?: any;

  constructor(config: EditingAbilityConfig) {
    super(AbilityTypeEnum.Editing, [
      ActionType.GetSelectedText,
      ActionType.HighlightSelectedText,
      ActionType.RemoveAllHighlights,
      ActionType.ReplaceHighlightedText,
      ActionType.CreateChatBox,
      ActionType.InitChat,
      ActionType.ChatCompletion,
    ]);

    this.config = config;
    this.bindUITriggers(config.uiTriggers);
  }

  async init(): Promise<void> {
    rangy.init();
    this.callBindedAction(
      ActionType.InitChat,
      this.config.modelId,
      this.config.engineConfig,
      this.config.chatOptions,
    );
  }

  async execute(selector: string): Promise<void> {
    const selectedText = await this.callBindedAction(
      ActionType.GetSelectedText,
      selector,
    );
    if (!selectedText) {
      return;
    }
    this.selectedText = selectedText;
    await this.callBindedAction(ActionType.RemoveAllHighlights);
    await this.callBindedAction(ActionType.HighlightSelectedText);

    // Only one chatbox is allowed at a time
    if (!this.chatBox) {
      this.chatBox = await this.callBindedAction(
        ActionType.CreateChatBox,
        selector,
        async (input: string, chatBox: ChatBox) => {
          const request: ChatCompletionRequest = {
            stream: true,
            messages: [
              {
                role: "user",
                content: `Use the following context when answering the question at the end.\n
                Context: ${this.selectedText}\n\nQuestion: ${input}`,
              },
            ],
          };
          const completion = (await this.callBindedAction(
            ActionType.ChatCompletion,
            request,
          )) as AsyncIterable<ChatCompletionChunk>;

          let message = "";
          for await (const chunk of completion) {
            if (chunk.choices[0].delta.content) {
              message += chunk.choices[0].delta.content;
            }
            chatBox.setOutputText(message);
          }
        },
        async (output: string, chatBox: ChatBox) => {
          this.callBindedAction(ActionType.ReplaceHighlightedText, output);
          chatBox.hide();
          chatBox.clearInputAndOutput();
          await this.callBindedAction(ActionType.RemoveAllHighlights);
        },
        async (chatBox: ChatBox) => {
          chatBox.hide();
          chatBox.clearInputAndOutput();
          await this.callBindedAction(ActionType.RemoveAllHighlights);
        },
      );
      this.selector = selector;
    } else {
      if (this.selector !== selector) {
        this.chatBox.remove();
        this.chatBox = undefined;
        this.selector = selector;
        return this.execute(selector);
      }
    }
    this.chatBox.displayUnderSelectedText();
  }
}
