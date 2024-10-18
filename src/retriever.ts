import { State } from "./state";

export const getSelectedText = (state: State): string => {
  if (!state.currentSelection) {
    return "";
  }
  return state.currentSelection.toString();
};
