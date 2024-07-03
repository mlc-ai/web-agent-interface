import { ActionType, ActionFunctionMap } from "../action/actions";

export enum EnvironmentTypeEnum {
  Chat,
  DomTree,
}

export type EnvironmentType = EnvironmentTypeEnum | string;

export class Environment {
  environmentType: EnvironmentType;
  supportedActions: Map<ActionType, (...args: any) => any> = new Map();

  constructor(environmentType: EnvironmentType) {
    this.environmentType = environmentType;
  }

  registerAction<T extends ActionType>(
    actionType: T,
    actionFn: ActionFunctionMap[T],
  ): void {
    this.supportedActions.set(actionType, actionFn);
  }

  getSupportedActionTypes(): ActionType[] {
    return [...this.supportedActions.keys()];
  }

  async executeAction<T extends ActionType>(
    actionType: T,
    ...args: Parameters<ActionFunctionMap[T]>
  ): Promise<ReturnType<ActionFunctionMap[T]>> {
    const actionFn = this.supportedActions.get(actionType);
    if (actionFn) {
      return actionFn(...args);
    }
    throw new Error(
      `Action ${ActionType[actionType]} is not supported in this environment`,
    );
  }
}
