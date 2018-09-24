import {
  Component
} from '@angular/core';

import {
  CameraService
} from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public routes: Array<string>;

  constructor (
    private cameraService: CameraService
  ) {
    this.routes = this.cameraService
      .getRouteKeys();
  }

  public getStateForRoute(route: any) {
    return this.cameraService.getStateForRoute(route.key);
  }
}
