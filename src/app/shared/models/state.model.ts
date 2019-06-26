import {
  Mode,
  NavPane,
  View
} from './index';

export class State {

  // Default state!
  public selected?: Array<string> = [];
  public view?: View = View.CARDS;
  public mode?: Mode = Mode.STREAM;
  public navPane?: NavPane = NavPane.COLLAPSED;
  public zoom?: number = 8;
  public lat?: number = 34.009967;
  public lng?: number = -81.050091;

  constructor(state?: State) {
    if (state) {
      this.selected = state.selected;

      if (state.hasOwnProperty('view')) {
        this.view = state.view;
      }

      if (state.hasOwnProperty('mode')) {
        this.mode = state.mode;
      }

      if (state.hasOwnProperty('navPane')) {
        this.navPane = state.navPane;
      }

      if (state.hasOwnProperty('zoom')) {
        this.zoom = state.zoom;
      }

      if (state.hasOwnProperty('lat')) {
        this.lat = state.lat;
      }

      if (state.hasOwnProperty('lng')) {
        this.lng = state.lng;
      }
    }
  }
}
