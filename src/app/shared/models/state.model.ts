import {
  View,
  Mode
} from './index';

export class State {
  public selected?: Array<string>;
  public view?: View = View.CARDS;
  public mode?: Mode = Mode.STREAM;

  constructor(state?: State) {
    if (state) {
      this.selected = state.selected;
      this.view = state.view;
      this.mode = state.mode;
    }
  }
}
