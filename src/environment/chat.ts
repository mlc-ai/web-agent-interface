import { Environment, EnvironmentTypeEnum } from "./environment";
import { ActionType } from "../action";
import {
  ChatCompletionRequest,
  ChatModule,
  ChatOptions,
  InitProgressCallback,
} from "@mlc-ai/web-llm";

export class ChatEnvironment extends Environment {
  cm?: ChatModule;

  constructor() {
    super(EnvironmentTypeEnum.Chat);
    this.registerInitChatAction();
    this.registerChatCompletionAction();
  }

  registerInitChatAction() {
    this.registerAction(
      ActionType.InitChat,
      async (
        modelId: string,
        chatOpts?: ChatOptions,
        initProgressCallback?: InitProgressCallback,
      ) => {
        if (this.cm) {
          return;
        }
        this.cm = new ChatModule();
        if (initProgressCallback) {
          this.cm.setInitProgressCallback(initProgressCallback);
        }
        await this.cm.reload(modelId, chatOpts);
      },
    );
  }

  registerChatCompletionAction() {
    this.registerAction(
      ActionType.ChatCompletion,
      async (request: ChatCompletionRequest) => {
        if (!this.cm) {
          throw new Error(
            "Chat module is not initialized. Please call InitChat first.",
          );
        }
        const reply = await this.cm.chatCompletion(request);
        return reply;
      },
    );
  }
}
