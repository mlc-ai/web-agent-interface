import { Environment, EnvironmentType, EnvironmentTypeEnum } from "./environment";
import { ChatEnvironment } from "./chat";
import { DOMTreeEnvironment } from "./dom_tree";

export class EnvironmentRegistry {
    customEnvironments: Environment[] = [];
  
    constructor(customEnvironments: Environment[] = []) {
      this.customEnvironments = customEnvironments;
    }
  
    getEnvironment(environment: EnvironmentType): Environment | undefined {
      if (typeof environment === "string") {
        return this.customEnvironments.find(
          (e) => e.environmentType === environment
        );
      }
      return this.getBuiltInEnvironment(environment);
    }
  
    private getBuiltInEnvironment(
      environment: EnvironmentTypeEnum
    ): Environment {
      switch (environment) {
        case EnvironmentTypeEnum.Chat:
          return new ChatEnvironment();
        case EnvironmentTypeEnum.DomTree:
          return new DOMTreeEnvironment();
      }
    }
  }