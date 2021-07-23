import {
  Component, Input
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  Subscription
} from 'rxjs';

import {
  CameraService,
  StateService
} from '../../services';

import {
  View,
  Route
} from '../../models';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent {

  @Input()
  public buttonText: string | undefined;

  public routes: Route[] | undefined;

  public feed = ['/feeds/scdot'];

  private subscriptions: Array<Subscription> = [];

  constructor (
    private cameraService: CameraService,
    private stateService: StateService,
    private router: Router
  ) {
    this.subscriptions.push(
      this.cameraService
        .getRoutes()
        .subscribe((routes: Route[]) => this.routes = routes)
    );
  }

  public btnClickLaunchMapView() {
    this.navigate(View.MAP, false);
  }

  public btnClickLaunchCardViewAndCameraSelector() {
    this.navigate(View.CARDS, true);
  }

  public getStateForRoute(route: Route) {
    return this.cameraService
      .getStateForRoute(route);
  }

  private navigate(view: View, launchSelector: boolean) {
    this.router
      .navigate(this.feed)
      .then(() => {
        this.stateService.set({
          view
        });

        if (launchSelector) {
          this.cameraService
            .launchCameraSelector();
        }
      });
  }
}
