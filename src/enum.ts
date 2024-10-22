/* Which domain should a tool be availale */
export enum Scope {
  Any = "Any",
  Overleaf = "Overleaf",
  GoogleDoc = "Google Doc",
}

export enum ToolType {
  Action = "action",
  Retriever = "retriever",
}

/* Who should call this function */
export enum CallerType {
  Any = "any",
  ContentScript = "content script",
}
