
import {map} from 'rxjs/operators';
import {
  Injectable
} from '@angular/core';

import {
  ReplaySubject,
  Observable
} from 'rxjs';

import {
  SkyAppConfig
} from '@skyux/config';

@Injectable()
export class ThumbnailService {

  private thumbnailBaseUrl: string;

  private timestamp = new ReplaySubject<number>(1);

  constructor(
    skyAppConfig: SkyAppConfig
  ) {

    this.thumbnailBaseUrl = skyAppConfig.skyux
      .appSettings
      .bffServiceUrl + '/thumbnail/';
    this.refresh();
  }

  public refresh() {
    this.timestamp.next((new Date()).getTime());
  }

  public getThumbnailById(id: string): Observable<string> {
    return this.timestamp.pipe(map((ts: number) => {
      return this.thumbnailBaseUrl + id + '?ts=' + ts;
    }));
  }
}
