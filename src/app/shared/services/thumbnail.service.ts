import {
  Injectable
} from '@angular/core';

import {
  ReplaySubject
} from 'rxjs';

import {
  map
} from 'rxjs/operators';

@Injectable()
export class ThumbnailService {

  private timestamp = new ReplaySubject<number>(1);

  constructor() {
    this.refresh();
  }

  public refresh() {
    this.timestamp.next((new Date()).getTime());
  }

  public getThumbnailByFeature(feature: any) {
    return this.timestamp.pipe(map((ts: number) => {
      return feature.properties.image_url + '?ts=' + ts;
    }));
  }
}
