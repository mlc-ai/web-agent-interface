import { Action } from '../action';

export class Page {
  availableActions: string[] = [];
  nameToAction: { [key: string]: Action } = {};
  
  // possible actions
  getSelectText: Action;
  replaceSelectedText: Action;
}