export enum Scope {
  DOM = "DOM",
}

export class State {
  public currentSelection: Selection | undefined;
  private scopeRegistration = {
    DOM: this.registerDOM,
  };

  constructor(scopes: Scope[]) {
    this.registerScopes(scopes);
  }

  private registerScopes(scopes: Scope[]) {
    scopes.forEach((scope) => {
      this.scopeRegistration[scope]();
    });
  }

  private registerDOM() {
    document.addEventListener("selectionchange", (): void => {
      const selection = window.getSelection();
      if (
        selection &&
        typeof selection.rangeCount !== "undefined" &&
        selection.rangeCount > 0
      ) {
        this.currentSelection = selection;
      }
    });
  }
}
