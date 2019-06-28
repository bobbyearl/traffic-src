import {
  Component, Input
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  CameraService,
  StateService
} from '../../services';

import {
  View
} from '../../models';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent {

  @Input()
  public buttonText: string;

  public routes: Array<string>;

  public feed = ['/feeds/scdot'];

  constructor (
    private cameraService: CameraService,
    private stateService: StateService,
    private router: Router
  ) {
    this.routes = this.cameraService
      .getRoutes();
  }

  public btnClickLaunchMapView() {
    this.navigate(View.MAP, false);
  }

  public btnClickLaunchCardViewAndCameraSelector() {
    this.navigate(View.CARDS, true);
  }

  public getStateForRoute(route: any) {
    return this.cameraService
      .getStateForRoute(route.key);
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
