import { Ability, AbilityTypeEnum, UITrigger } from "./ability";
import { ActionType } from "../action";
import {
  ChatCompletion,
  ChatCompletionRequest,
  ChatOptions,
  InitProgressCallback,
} from "@mlc-ai/web-llm";
import { ChatBox } from "../environment";
// @ts-ignore
import * as rangy from 'rangy'
// @ts-ignore
import 'rangy/lib/rangy-selectionsaverestore'

export interface EditingAbilityConfig {
  // Triggering conditions
  uiTriggers: UITrigger[];

  // Chat related configs
  modelId: string;
  chatOptions?: ChatOptions;
  initProgressCallback?: InitProgressCallback;
}

export class EditingAbility extends Ability {
  config: EditingAbilityConfig;
  chatBox?: ChatBox;
  selector?: string;
  savedSelection?: any;

  constructor(config: EditingAbilityConfig) {
    super(AbilityTypeEnum.Editing, [
      ActionType.GetSelectedText,
      ActionType.ReplaceSelectedText,
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
      this.config.chatOptions,
      this.config.initProgressCallback
    );
  }

  async execute(selector: string): Promise<void> {
    const selectedText = await this.callBindedAction(
      ActionType.GetSelectedText,
      selector
    );
    if (!selectedText) {
      return;
    }

    this.savedSelection = rangy.saveSelection();
    // Only one chatbox is allowed at a time
    if (!this.chatBox) {
      this.chatBox = await this.callBindedAction(
        ActionType.CreateChatBox,
        selector,
        async (input: string, chatBox: ChatBox) => {
          rangy.restoreSelection(this.savedSelection, true);
          const text = await this.callBindedAction(
            ActionType.GetSelectedText,
            selector
          );
          const request: ChatCompletionRequest = {
            stream: false,
            messages: [
              {
                role: "user",
                content: `Use the following context when answering the question at the end.\nContext: ${text}\n\nQuestion: ${input}`,
              },
            ],
          };
          const completion = (await this.callBindedAction(
            ActionType.ChatCompletion,
            request
          )) as ChatCompletion;
          const responseMessage = completion.choices[0].message.content;
          if (responseMessage) {
            chatBox.setOutputText(responseMessage);
          }
        },
        async (output: string, chatBox: ChatBox) => {
          rangy.restoreSelection(this.savedSelection, true);
          this.callBindedAction(
            ActionType.ReplaceSelectedText,
            output,
            selector
          );
          chatBox.hide();
        },
        (chatBox: ChatBox) => {
          chatBox.hide();
        }
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
