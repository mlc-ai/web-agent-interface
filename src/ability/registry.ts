import {
  Ability,
  AbilityType,
  AbilityTypeEnum,
} from "./ability";
import { EditingAbility, EditingAbilityConfig } from "./editing";
import { Environment } from "../environment";

// This will be the union of all the ability configurations
export type AbilityConfig = EditingAbilityConfig;

export class AbilityRegistry {
  customAbilities: Ability[] = [];

  constructor(customAbilities: Ability[] = []) {
    this.customAbilities = customAbilities;
  }

  getAbility(
    ability: AbilityType,
    envs: Environment[],
    config?: AbilityConfig
  ): Ability | undefined {
    if (typeof ability === "string") {
      const customAbility = this.customAbilities.find(
        (a) => a.abilityType === ability
      );
      if (customAbility) {
        if (customAbility.isApplicable(envs)) {
          customAbility.bindEnvironments(envs);
          return customAbility;
        }
      }
      return undefined;
    }
    return this.getBuiltInAbility(ability, envs, config);
  }

  private getBuiltInAbility(
    ability: AbilityTypeEnum,
    envs: Environment[],
    config?: AbilityConfig
  ): Ability | undefined {
    switch (ability) {
      case AbilityTypeEnum.Editing:
        if (!config) {
          throw new Error("Editing ability requires a configuration");
        }
        const editingAbility = new EditingAbility(config);
        if (editingAbility.isApplicable(envs)) {
          editingAbility.bindEnvironments(envs);
          return editingAbility;
        }
        break;
    }
    return undefined;
  }
}
