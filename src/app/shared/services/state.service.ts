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
  SkyModalCloseArgs,
  SkyModalInstance,
  SkyModalService
} from '@skyux/modals';

import {
  State
} from '../models';

import {
  SettingsComponent
} from '../components/settings-component/settings.component';

@Injectable()
export class StateService {

  private state: State = new State();

  private subscription = new ReplaySubject<State>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private skyModalService: SkyModalService
  ) {
    this.route
      .fragment
      .subscribe((fragment: string) => {
        if (fragment) {
          try {
            const parsed = JSON.parse(fragment);
            this.state = new State(parsed);
          } catch (err) {
            console.warn('Invalid state');
          }
        } else {
          this.state = new State();
        }

        this.subscription.next(this.state);
      });
  }

  public set(state: State) {
    const newState = new State(this.state);

    if (state.density) {
      newState.density = state.density;
    }

    if (state.lat) {
      newState.lat = state.lat;
    }

    if (state.lng) {
      newState.lng = state.lng;
    }

    if (state.mode) {
      newState.mode = state.mode;
    }

    if (state.navPane) {
      newState.navPane = state.navPane;
    }

    if (state.selected) {
      newState.selected = state.selected;
    }

    if (state.view) {
      newState.view = state.view;
    }

    if (state.zoom) {
      newState.zoom = state.zoom;
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

  public launchStateSettingsModal(): SkyModalInstance {
    const instance =  this.skyModalService.open(SettingsComponent);

    instance.closed
      .subscribe((result: SkyModalCloseArgs) => {
        console.log(`Modal closed with reason: ${result.reason} and data: ${result.data}`);
      });

    return instance;
  }
}
