
import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  ReplaySubject,
  combineLatest,
  of
} from 'rxjs';

import {
  map
} from 'rxjs/operators';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  SkyFlyoutInstance,
  SkyFlyoutService
} from '@skyux/flyout';

import {
  StateService
} from './state.service';

import {
  CameraSelectorComponent
} from '../components';

import {
  Route,
  State,
  View
} from '../models';

@Injectable()
export class CameraService {

  public static maximumMapCameraWarning = 4;

  private routes: Route[] = [
    {
      name: '526 E',
      description: 'Cameras on I-526 east of I-26 interchange.',
      ids: [
        'e7215325-d2a0-11e6-8996-0123456789ab',
        'e7215326-d2a0-11e6-8996-0123456789ab',
        'e721532a-d2a0-11e6-8996-0123456789ab',
        'e721532b-d2a0-11e6-8996-0123456789ab',
        'e721532c-d2a0-11e6-8996-0123456789ab',
        'e723eb35-d2a0-11e6-8996-0123456789ab',
        'e723eb36-d2a0-11e6-8996-0123456789ab',
        'e723eb3c-d2a0-11e6-8996-0123456789ab',
        'e72300da-d2a0-11e6-8996-0123456789ab',
        'e724877a-d2a0-11e6-8996-0123456789ab',
        'e724fca0-d2a0-11e6-8996-0123456789ab',
        'e72300de-d2a0-11e6-8996-0123456789ab'
      ]
    },
    {
      name: '526 W',
      description: 'Cameras on I-526 west of I-26 interchange.',
      ids: [
        'e7215329-d2a0-11e6-8996-0123456789ab',
        '26e01dd0-690e-11e7-8996-0123456789ab',
        '26e01dd1-690e-11e7-8996-0123456789ab',
        'e723eb39-d2a0-11e6-8996-0123456789ab',
        'e723eb3a-d2a0-11e6-8996-0123456789ab',
        'e723eb3b-d2a0-11e6-8996-0123456789ab',
        'e7241240-d2a0-11e6-8996-0123456789ab',
        'e724877c-d2a0-11e6-8996-0123456789ab'
      ]
    },
    {
      name: '26 Outer',
      description: 'Cameras on I-26 in the Summerville area.',
      ids: [
        'e7212c20-d2a0-11e6-8996-0123456789ab',
        'e7212c21-d2a0-11e6-8996-0123456789ab',
        'e7215320-d2a0-11e6-8996-0123456789ab',
        'e72523bd-d2a0-11e6-8996-0123456789ab',
        '1534',
        'e723c430-d2a0-11e6-8996-0123456789ab',
        'e723c431-d2a0-11e6-8996-0123456789ab',
        'e723c432-d2a0-11e6-8996-0123456789ab',
        'e723eb30-d2a0-11e6-8996-0123456789ab',
        '2473',
        'e7248776-d2a0-11e6-8996-0123456789ab',
        'e72300d7-d2a0-11e6-8996-0123456789ab',
        'e7248777-d2a0-11e6-8996-0123456789ab',
        'e724fca4-d2a0-11e6-8996-0123456789ab'
     ]
    },
    {
      name: '26 Middle',
      description: 'Cameras on I-26 in the North Charleston area.',
      ids: [
        'e7215322-d2a0-11e6-8996-0123456789ab',
        'e7215323-d2a0-11e6-8996-0123456789ab',
        'e7215321-d2a0-11e6-8996-0123456789ab',
        'e7215324-d2a0-11e6-8996-0123456789ab',
        'e723eb31-d2a0-11e6-8996-0123456789ab',
        'e723eb32-d2a0-11e6-8996-0123456789ab',
        'e723eb33-d2a0-11e6-8996-0123456789ab',
        'e723eb34-d2a0-11e6-8996-0123456789ab',
        'e723eb38-d2a0-11e6-8996-0123456789ab',
        'e7241245-d2a0-11e6-8996-0123456789ab',
        'e72300d8-d2a0-11e6-8996-0123456789ab',
        'e7248778-d2a0-11e6-8996-0123456789ab',
        'e72300d9-d2a0-11e6-8996-0123456789ab',
        'e7248779-d2a0-11e6-8996-0123456789ab',
        'e72300dc-d2a0-11e6-8996-0123456789ab'
      ]
    },
    {
      name: '26 Inner',
      description: 'Cameras I-26 East of the I-526 interchange.',
      ids: [
        'e7215327-d2a0-11e6-8996-0123456789ab',
        'e7215328-d2a0-11e6-8996-0123456789ab',
        'e721532d-d2a0-11e6-8996-0123456789ab',
        'e7217a30-d2a0-11e6-8996-0123456789ab',
        'e723eb37-d2a0-11e6-8996-0123456789ab',
        'e7241241-d2a0-11e6-8996-0123456789ab',
        'e72300db-d2a0-11e6-8996-0123456789ab',
        'e724877b-d2a0-11e6-8996-0123456789ab',
        'e724fca1-d2a0-11e6-8996-0123456789ab',
        'e72300df-d2a0-11e6-8996-0123456789ab',
        '2564',
        '2565',
        '2566'
      ]
    },
    {
      name: 'Ravenel Bridge',
      description: 'Cameras on the Arthur Ravenel Bridge.',
      ids: [
        'e7217a31-d2a0-11e6-8996-0123456789ab',
        'e7217a32-d2a0-11e6-8996-0123456789ab',
        'e7217a33-d2a0-11e6-8996-0123456789ab',
        'e7217a35-d2a0-11e6-8996-0123456789ab',
        'e721a140-d2a0-11e6-8996-0123456789ab',
        'e72327e0-d2a0-11e6-8996-0123456789ab',
        'e7241242-d2a0-11e6-8996-0123456789ab',
        'e7241243-d2a0-11e6-8996-0123456789ab',
        'e7241244-d2a0-11e6-8996-0123456789ab',
        'e7241246-d2a0-11e6-8996-0123456789ab',
        'e724fca2-d2a0-11e6-8996-0123456789ab'
      ]
    },
    {
      name: 'Beaches',
      description: 'Cameras at IOP and Sullivans.',
      ids: [
        '4ba32f32-2df2-11e6-8d81-0123456789ab',
        '26e01dd4-690e-11e7-8996-0123456789ab',
        '26e01dd6-690e-11e7-8996-0123456789ab'
      ]
    }
  ];

  private selected = new ReplaySubject<any>();

  private selectedRoute = new ReplaySubject<any>();

  private features = new ReplaySubject<any>(1);

  private flyout: SkyFlyoutInstance<CameraSelectorComponent>;

  constructor(
    private assets: SkyAppAssetsService,
    private flyoutService: SkyFlyoutService,
    private http: HttpClient,
    private stateService: StateService
  ) {

    this.routes.forEach((route: Route) => {
      route.active = false;
      route.joined = route.ids
        .sort()
        .join();
    });

    this.http
      .get(this.assets.getUrl('cameras-2021-07-22.json'))
      .subscribe((data: any) => {
        const mapped: any = {};

        data.features.forEach((feature: any) => {
          const key = feature.properties.jurisdiction;
          feature.coordinates = {
            lat: parseFloat(feature.geometry.coordinates[1]),
            lng: parseFloat(feature.geometry.coordinates[0])
          };
          mapped[key] = mapped[key] || [];
          mapped[key].push(feature);
        });

        data.regions = Object.keys(mapped)
          .sort()
          .map((name: string) => {
            return {
              name,
              features: mapped[name]
            };
          });

        this.features.next(data);
      });
  }

  // May make this dynamic in the future
  public getRoutes(): Observable<Route[]> {
    return of(this.routes);
  }

  public getSelectedRoute(): Observable<Route> {
    return this.selectedRoute;
  }

  public getStateForRoute(route: Route) {
    const state = new State({
      selected: route.ids
    });

    return this.stateService.
      getStateLink(state);
  }

  public getFeatures(): Observable<any> {

    const $combined = combineLatest([
      this.stateService.get(),
      this.features.asObservable()
    ]);

    return $combined.pipe(map((subscriptions: any) => {
      const state: State = subscriptions[0];
      const data = subscriptions[1];
      const joined = state.selected ? state.selected.sort().join() : '';

      data.features.forEach((feature: any) => {
        feature.selected = state.selected && state.selected.indexOf(feature.properties.id) > -1;
      });

      let activeRoute: Route;
      this.routes.forEach((route: Route) => {
        route.active = route.joined === joined;
        if (route.active) {
          activeRoute = route;
        }
      });
      this.selectedRoute.next(activeRoute);

      return data;
    }));
  }

  public getSelectedFeatures(): Observable<any> {
    const $combined = combineLatest([
      this.stateService.get(),
      this.getFeatures()
    ]);

    $combined.subscribe((subscriptions: any) => {
      const state: State = subscriptions[0];
      const data = subscriptions[1];
      let selected;

      if (state.selected) {
        selected = state.selected
            .map((id: string) => {
              return data.features
                .find((f: any) => f.properties.id === id);
            })
            .filter((feature: any, index: number) => {
              if (!feature) {
                console.warn(`Invalid ID ${state.selected[index]}`);
                return false;
              }

              return true;
            });
      }

      this.selected.next(selected);
    });

    return this.selected.asObservable();
  }

  public launchCameraSelector(view?: View) {
    this.flyout = this.flyoutService
      .open(CameraSelectorComponent, {
        defaultWidth: 380,
        maxWidth: 600
      });

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }
}
