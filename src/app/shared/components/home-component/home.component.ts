import {
  Component
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  CameraService, StateService
} from '../../services';

import {
  View
} from '../../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public routes: Array<string>;

  private feed = ['/feeds/scdot'];

  constructor (
    private cameraService: CameraService,
    private stateService: StateService,
    private router: Router
  ) {
    this.routes = this.cameraService
      .getRoutes();
  }

  public btnClickRoute(route: any) {
    this.router
      .navigate(
        this.feed,
        {
          fragment: this.cameraService.getStateForRoute(route.key)
        }
      );
  }

  public btnClickLaunchMapView() {
    this.router
      .navigate(
        this.feed,
        {
          fragment: this.stateService.getStateLink({ view: View.MAP })
        }
      );
  }

  public btnClickLaunchCameraSelector() {
    this.cameraService.launchCameraSelector();
  }
}
