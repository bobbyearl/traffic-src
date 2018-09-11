import {
  View
} from './index';

export class State {
  public selected?: Array<string>;
  public view?: View;

  constructor(state?: State) {
    if (state) {
      this.selected = state.selected;
      this.view = state.view;
    }
  }
}
