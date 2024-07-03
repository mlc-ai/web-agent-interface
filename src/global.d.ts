declare module "rangy" {
  interface RangyHighlighter {
    addClassApplier(classApplier: RangyClassApplier): void;
    highlightSelection(className: string): void;
  }

  interface RangyClassApplier {
    applyToSelection(win: Window): void;
  }

  interface RangyExtendedStatic {
    init(): void;
    createHighlighter(): RangyHighlighter;
    createClassApplier(
      className: string,
      options?: {
        ignoreWhiteSpace?: boolean;
        tagNames?: string[];
      },
    ): RangyClassApplier;
    saveSelection(): any;
    restoreSelection(savedSelection: any, preserve: boolean): void;
  }

  const rangy: RangyStatic & RangyExtendedStatic;

  export = rangy;
}
