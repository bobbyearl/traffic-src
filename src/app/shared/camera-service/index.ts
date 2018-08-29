import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SkyAppAssetsService } from '@blackbaud/skyux-builder/runtime/assets.service';
import { Observable } from 'rxjs/Observable';
import { Utils } from '../utils';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class CameraService {

  private promise: Promise<any>;

  constructor(
    private assets: SkyAppAssetsService,
    private http: Http
  ) {

  }

  public init(): Promise<any> {
    if (this.promise) {
      return this.promise;
    }

    this.promise = Utils.registerScript(this.assets.getUrl('camera-overlay-js/index.js'));
    return this.promise;
  }

  public getFeatures(): Observable<any> {
    return this.http
      .get(this.assets.getUrl('cameras-2018-08-26.json'))
      .map(res => res.json())
      .share();
  }
}
