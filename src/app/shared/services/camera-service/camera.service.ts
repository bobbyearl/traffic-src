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
  Observable
} from 'rxjs/Observable';

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

  constructor(
    private assets: SkyAppAssetsService,
    private http: Http,
    private stateService: StateService
  ) { }

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
    return this.getFeatures()
      .map((data: any) => {
        return data.features
          .filter((feature: any) => feature.selected);
      });
  }
}
