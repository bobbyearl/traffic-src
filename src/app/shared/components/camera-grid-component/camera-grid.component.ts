import {
  Component,
  Input,
  OnDestroy
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  CameraService,
  StateService
} from '../../services';

import {
  Density,
  Route,
  State
} from '../../models';

@Component({
  selector: 'app-camera-grid',
  templateUrl: './camera-grid.component.html',
  styleUrls: ['./camera-grid.component.scss']
})
export class CameraGridComponent implements OnDestroy {

  @Input()
  public features: Array<any> = [];

  public camerasPluralMapping = {
    '=0' : '0 cameras',
    '=1' : '1 camera',
    'other' : '# cameras'
  };

  public densities = [
    {
      columns: 1,
      name: 'Tiny',
      icon: 'table',
      value: Density.XS
    },
    {
      columns: 3,
      name: 'Small',
      icon: 'th',
      value: Density.SM
    },
    {
      columns: 6,
      name: 'Medium',
      icon: 'th-large',
      value: Density.MD
    },
    {
      columns: 12,
      name: 'Large',
      icon: 'th-list',
      value: Density.LG
    }
  ];

  public selectedDensity: Density;

  public selectedRoute: Route;

  public columns: number;

  private subscriptions: Array<Subscription> = [];

  constructor (
    private cameraService: CameraService,
    private stateService: StateService
  ) {
    this.subscriptions.push(
      this.stateService
        .get()
        .subscribe((state: State) => {
          this.densities.some((density: any) => {
            if (density.value === state.density) {
              this.selectedDensity = state.density;
              this.columns = density.columns;
              return true;
            }
          });
        })
    );
    this.subscriptions.push(
      this.cameraService
        .getSelectedRoute()
        .subscribe((route: Route) => this.selectedRoute = route)
    );
  }

  public onDensityChange(evt: any) {
    this.stateService.set({
      density: evt.value
    });
  }

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }
}
