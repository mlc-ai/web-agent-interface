/**
 * Abstract class for actions
 * @class Action
 */
export class Action {
  implementation;
  
  constructor(impl) {
    this.implementation = impl;
  }
  
  call = (params) => {
    this.implementation(params);
  }
}