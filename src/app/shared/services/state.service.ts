import {
  Injectable
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Observable,
  ReplaySubject
} from 'rxjs';

import {
  State
} from '../models';

@Injectable()
export class StateService {

  private state: State = new State();

  private subscription = new ReplaySubject<State>();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route
      .fragment
      .subscribe((fragment: string) => {
        if (fragment) {
          try {
            const parsed = JSON.parse(fragment);
            this.state = new State(parsed);
          } catch (err) {
            console.error(err);
          }
        } else {
          this.state = new State();
        }

        this.subscription.next(this.state);
      });
  }

  public set(state: State) {
    const newState = new State(this.state);

    if (state.selected) {
      newState.selected = state.selected;
    }

    if (state.view) {
      newState.view = state.view;
    }

    if (state.mode) {
      newState.mode = state.mode;
    }

    if (state.navPane) {
      newState.navPane = state.navPane;
    }

    if (state.zoom) {
      newState.zoom = state.zoom;
    }

    if (state.lat) {
      newState.lat = state.lat;
    }

    if (state.lng) {
      newState.lng = state.lng;
    }

    this.router.navigate([], {
      fragment: JSON.stringify(newState)
    });
  }

  public get(): Observable<State> {
    return this.subscription.asObservable();
  }

  public getStateLink(state: State): string {
    return JSON.stringify(state);
  }
}
