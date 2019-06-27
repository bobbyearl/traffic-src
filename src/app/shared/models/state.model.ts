import {
  Density,
  Mode,
  NavPane,
  View
} from './index';

export class State {

  // Default state!
  public density?: Density = Density.MD;
  public lat?: number = 34.009967;
  public lng?: number = -81.050091;
  public mode?: Mode = Mode.STREAM;
  public navPane?: NavPane = NavPane.COLLAPSED;
  public selected?: Array<string>;
  public view?: View = View.CARDS;
  public zoom?: number = 8;

  constructor(state?: State) {
    if (state) {
      this.selected = state.selected;

      if (state.hasOwnProperty('density')) {
        this.density = state.density;
      }

      if (state.hasOwnProperty('lat')) {
        this.lat = state.lat;
      }

      if (state.hasOwnProperty('lng')) {
        this.lng = state.lng;
      }

      if (state.hasOwnProperty('mode')) {
        this.mode = state.mode;
      }

      if (state.hasOwnProperty('navPane')) {
        this.navPane = state.navPane;
      }

      if (state.hasOwnProperty('view')) {
        this.view = state.view;
      }

      if (state.hasOwnProperty('zoom')) {
        this.zoom = state.zoom;
      }
    }
  }
}
