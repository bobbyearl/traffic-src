import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  ReplaySubject,
  combineLatest
} from 'rxjs';

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
  State,
  View
} from '../models';

@Injectable()
export class CameraService {

  public static maximumMapCameraWarning = 4;

  private routes: any = {
    '526 E': {
      description: 'Cameras on I-526 east of I-26 interchange.',
      ids: [
        '60043',
        '60044',
        '60025',
        '60026',
        '60027',
        '60028',
        '60029',
        '60030',
        '60046',
        '60047',
        '80004',
        '80005',
        '60048',
        '60049',
        '60050'
      ]
    },
    '526 W': {
      description: 'Cameras on I-526 west of I-26 interchange.',
      ids: [
        '60039',
        '60040',
        '60041',
        '60055',
        '60045',
        '60052',
        '60042',
        '60053'
      ]
    },
    '26 Outer': {
      description: 'Cameras on I-26 in the Summerville area.',
      ids: [
        '60101',
        '60100',
        '60002',
        '60096',
        '60097',
        '60003',
        '60004',
        '60005',
        '60006',
        '60007',
        '60008',
        '60009'
     ]
    },
    '26 Middle': {
      description: 'Cameras on I-26 in the North Charleston area.',
      ids: [
        '60009',
        '60010',
        '60012',
        '60095',
        '60013',
        '60014',
        '60015',
        '60016',
        '60017',
        '60018',
        '60019',
        '60020',
        '60021',
        '60024'
      ]
    },
    '26 Inner': {
      description: 'Cameras I-26 west of the I-526 interchange.',
      ids: [
        '60036',
        '60037',
        '60023',
        '60022',
        '60038',
        '60031',
        '60032',
        '60033',
        '60054',
        '60034',
        '60060',
        '60061',
        '60062',
        '60063'
      ]
    },
    'Ravenel Bridge': {
      description: 'Cameras on the Arthur Ravenel Bridge.',
      ids: [
        '60064',
        '60065',
        '60066',
        '60067',
        '60068',
        '60069',
        '60070',
        '60071'
      ]
    }
  };

  private selected = new ReplaySubject<any>();

  private features = new ReplaySubject<any>(1);

  private flyout: SkyFlyoutInstance<CameraSelectorComponent>;

  constructor(
    private assets: SkyAppAssetsService,
    private flyoutService: SkyFlyoutService,
    private http: HttpClient,
    private stateService: StateService
  ) {
    this.http
      .get(this.assets.getUrl('cameras-2019-05-12.json'))
      .subscribe((data: any) => {
        const map: any = {};

        data.features.forEach((feature: any) => {
          const key = feature.properties.region;
          feature.coordinates = {
            lat: parseFloat(feature.geometry.coordinates[1]),
            lng: parseFloat(feature.geometry.coordinates[0])
          };
          map[key] = map[key] || [];
          map[key].push(feature);
        });

        data.regions = Object.keys(map)
          .sort()
          .map((name: string) => {
            return {
              name,
              features: map[name]
            };
          });

        this.features.next(data);
      });
  }

  public getRoutes(): Array<any> {
    return Object.keys(this.routes)
      .map((key: string) => ({
        key,
        description: this.routes[key].description,
        active: false,
        joined: this.routes[key].ids.sort().join()
      })) || [];
  }

  public getRouteIds(route: string) {
    return this.routes[route].ids;
  }

  public getStateForRoute(route: string) {
    const state = new State({
      selected: this.routes[route].ids
    });

    return this.stateService.getStateLink(state);
  }

  public getFeatures(): Observable<any> {

    const $combined = combineLatest([
      this.stateService.get(),
      this.features.asObservable()
    ]);

    return $combined.map((subscriptions: any) => {
      const state: State = subscriptions[0];
      const data = subscriptions[1];

      data.features.forEach((feature: any) => {
        feature.selected = state.selected && state.selected.indexOf(feature.id) > -1;
      });

      return data;
    });
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
                .find((f: any) => f.id === id);
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
