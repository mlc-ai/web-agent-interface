import { actions } from "./action";
import { retrievers } from "./retriever";
import { State } from "./state";

export const tool: Record<string, Tool> = {
  ...retrievers,
  ...actions,
};

export const toolName = Object.keys(tool);
export type ToolName = keyof typeof tool;

export interface Tool {
  name: ToolName;
  displayName: string;
  description: string;
  schema: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: "object";
        properties: Record<string, any>;
        required: Array<
          keyof Tool["schema"]["function"]["parameters"]["properties"]
        >;
      };
    };
  };
  implementation: (state: State, parameters: any) => void;
}
