export interface IPageHandler {
  handleToolCall(toolName: string, params: any): any;
}
