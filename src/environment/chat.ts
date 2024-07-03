import { Environment, EnvironmentTypeEnum } from "./environment";
import { ActionType } from "../action";
import {
  ChatCompletionRequest,
  CreateWebWorkerMLCEngine,
  MLCEngineInterface,
  ChatOptions,
  InitProgressCallback,
} from "@mlc-ai/web-llm";

export class ChatEnvironment extends Environment {
  engine?: MLCEngineInterface;

  constructor() {
    super(EnvironmentTypeEnum.Chat);
    this.registerInitChatAction();
    this.registerChatCompletionAction();
  }

  registerInitChatAction() {
    this.registerAction(
      ActionType.InitChat,
      async (
        worker: Worker,
        modelId: string,
        chatOpts?: ChatOptions,
        initProgressCallback?: InitProgressCallback,
      ) => {
        if (this.engine) {
          return;
        }
        this.engine = await CreateWebWorkerMLCEngine(
          worker,
          modelId,
          {
            initProgressCallback: initProgressCallback,
          },
          chatOpts,
        );
        console.log("Engine initialized");
      },
    );
  }

  registerChatCompletionAction() {
    this.registerAction(
      ActionType.ChatCompletion,
      async (request: ChatCompletionRequest) => {
        if (!this.engine) {
          throw new Error(
            "Engine is not initialized, or intialization is in progress. Please call InitChat first.",
          );
        }
        const reply = await this.engine.chat.completions.create(request);
        return reply;
      },
    );
  }
}
