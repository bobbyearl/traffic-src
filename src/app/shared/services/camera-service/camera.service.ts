import {
  Injectable
} from '@angular/core';

import {
  Http
} from '@angular/http';

import {
  SkyAppAssetsService
} from '@blackbaud/skyux-builder/runtime/assets.service';

import {
  Observable,
  ReplaySubject
} from 'rxjs';

import {
  StateService
} from '../state-service/state.service';

import {
  State
} from '../../models';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class CameraService {

  private routes: any = {
    '526 E': [
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
    ],
    '526 W': [
      '60039',
      '60040',
      '60041',
      '60055',
      '60045',
      '60052',
      '60042',
      '60053'
    ],
    '26 Outer': [
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
    ],
    '26 Middle': [
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
    ],
    '26 Inner': [
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
    ],
    'Ravenel Bridge': [
      '60064',
      '60065',
      '60066',
      '60067',
      '60068',
      '60069',
      '60070',
      '60071'
    ]
  };

  private selected = new ReplaySubject<any>();

  constructor(
    private assets: SkyAppAssetsService,
    private http: Http,
    private stateService: StateService
  ) { }

  public getRouteKeys(): Array<string> {
    return Object.keys(this.routes);
  }

  public getRouteIds(route: string) {
    return this.routes[route];
  }

  public getStateForRoute(route: string) {
    const state = new State({
      selected: this.routes[route]
    });

    return JSON.stringify(state);
  }

  public getFeatures(): Observable<any> {

    const $state = this.stateService.get();
    const $data = this.http
      .get(this.assets.getUrl('cameras-2018-08-26.json'))
      .share()
      .map(res => res.json());

    return Observable.combineLatest($state, $data)
      .map((subscriptions: any) => {

        const map: any = {};
        const state: State = subscriptions[0];
        const data = subscriptions[1];

        data.features.forEach((feature: any) => {
          const key = feature.properties.region;
          map[key] = map[key] || [];

          if (state.selected) {
            feature.selected = state.selected.indexOf(feature.id) > -1;
          }

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

        return data;
      });
  }

  public getSelectedFeatures(): Observable<any> {
    const $state = this.stateService.get();
    const $data = this.getFeatures();

    Observable.combineLatest($state, $data)
      .subscribe((subscriptions: any) => {
        const state: State = subscriptions[0];
        const data = subscriptions[1];
        const selected = state.selected.map((id: string) => {
          return data.features.find((f: any) => f.id === id);
        });
        this.selected.next(selected);
      });

    return this.selected.asObservable();
  }
}
