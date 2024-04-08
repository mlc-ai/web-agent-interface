import { ActionFunctionMap, ActionType } from "../action";
import { Environment } from "../environment";

export enum AbilityTypeEnum {
  Editing,
}

export type AbilityType = AbilityTypeEnum | string;

export interface UITrigger {
  selector: string;
  eventType: string;
  condition: (event: Event) => boolean;
}

export abstract class Ability {
  abilityType: AbilityType;
  // The actions required to execute the ability
  requiredActions: ActionType[];
  // For each action, the environment that supports it
  bindedActions: Map<ActionType, Environment> = new Map();

  constructor(abilityType: AbilityType, requiredActions: ActionType[]) {
    this.abilityType = abilityType;
    this.requiredActions = requiredActions;
  }

  /**
   * Initialize the ability
   */
  abstract init(): Promise<void>;

  /**
   * Execute the ability
   *
   * @param selector The selector to execute the ability on
   */
  abstract execute(selector: string): any;

  isApplicable(envs: Environment[]) {
    const actions = new Set(
      envs.flatMap((env) => env.getSupportedActionTypes())
    );
    for (const action of this.requiredActions) {
      if (!actions.has(action)) {
        return false;
      }
    }
    return true;
  }

  bindEnvironments(envs: Environment[]) {
    // Bind the required actions to the environments
    this.requiredActions.forEach((action) => {
      for (const env of envs) {
        if (env.getSupportedActionTypes().includes(action)) {
          this.bindedActions.set(action, env);
          break;
        }
      }
    });
  }

  bindUITriggers(uiTriggers: UITrigger[]) {
    // Bind the UI triggers to the ability
    uiTriggers.forEach(({ selector, eventType, condition }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        element.addEventListener(eventType, (event) => {
          if (condition(event)) {
            this.execute(selector);
          }
        });
      });
    });
  }

  async callBindedAction<T extends ActionType>(
    action: T,
    ...args: Parameters<ActionFunctionMap[T]>
  ): Promise<ReturnType<ActionFunctionMap[T]>> {
    const env = this.bindedActions.get(action);
    if (!env) {
      throw new Error(`Action ${ActionType[action]} is not binded`);
    }
    return await env.executeAction(action, ...args);
  }
}
