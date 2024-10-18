export class State {
  public currentSelection: Selection | undefined;

  constructor() {
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
