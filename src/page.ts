import { Ability, AbilityType, AbilityRegistry, AbilityConfig, AbilityTypeEnum } from "./ability";
import {
  Environment,
  EnvironmentRegistry,
  EnvironmentType,
} from "./environment";

export interface PageConfiguration {
  name: string;
  // Environment configuration
  environments: EnvironmentType[];

  // Ability configuration. The key is the ability type and the value is the configuration
  requiredAbilities?: Map<AbilityType, AbilityConfig>;
}

export class BasicPage {
  envs: Environment[] = [];
  config: PageConfiguration;
  abilityRegistry: AbilityRegistry;
  environmentRegistry: EnvironmentRegistry;
  abilities: Map<AbilityType, Ability> = new Map();

  constructor(config: PageConfiguration) {
    this.config = config;
    this.abilityRegistry = new AbilityRegistry();
    this.environmentRegistry = new EnvironmentRegistry();
    this.extractEnvironments();
    this.extractAbilities();
  }

  async init(): Promise<void> {
    for (const ability of this.abilities.values()) {
      await ability.init();
    }
  }

  getAbility(abilityType: AbilityType): Ability | undefined {
    return this.abilities.get(abilityType);
  }

  private extractEnvironments() {
    // Extract the environments from the configuration
    this.config.environments?.filter((environment) => {
      const supportedEnvironment =
        this.environmentRegistry.getEnvironment(environment);
      if (supportedEnvironment) {
        this.envs.push(supportedEnvironment);
      }
    });
  }

  private extractAbilities() {
    // Extract the abilities from the configuration
    this.config.requiredAbilities?.forEach((config, abilityType) => {
      const supportedAbility = this.abilityRegistry.getAbility(
        abilityType,
        this.envs,
        config
      );

      if (supportedAbility) {
        this.abilities.set(abilityType, supportedAbility);
      } else {
        console.error(
          `Could not find a supported ability for ${abilityType}`
        );
      }
    });
  }
}
