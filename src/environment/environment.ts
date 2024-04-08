import { ActionType, ActionFunctionMap } from "../action/actions";

export enum EnvironmentTypeEnum {
  Chat,
  DomTree,
}

export type EnvironmentType = EnvironmentTypeEnum | string;

export class Environment {
  environmentType: EnvironmentType;
  supported_actions: Map<ActionType, (...args: any) => any> = new Map();

  constructor(environmentType: EnvironmentType) {
    this.environmentType = environmentType;
  }

  registerAction<T extends ActionType>(
    actionType: T,
    actionFn: ActionFunctionMap[T]
  ): void {
    this.supported_actions.set(actionType, actionFn);
  }

  getSupportedActionTypes(): ActionType[] {
    return [...this.supported_actions.keys()];
  }

  async executeAction<T extends ActionType>(
    actionType: T,
    ...args: Parameters<ActionFunctionMap[T]>
  ): Promise<ReturnType<ActionFunctionMap[T]>> {
    const actionFn = this.supported_actions.get(actionType);
    if (actionFn) {
      return actionFn(...args);
    }
    throw new Error(
      `Action ${ActionType[actionType]} is not supported in this environment`
    );
  }
}
