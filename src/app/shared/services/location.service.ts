import {
  Injectable
} from '@angular/core';

import {
  Subject,
  Observable
} from 'rxjs';

import {
  Location
} from '../interfaces';

@Injectable()
export class LocationService {

  private _location = new Subject<Location>();

  public get() {
    window.navigator
      .geolocation
      .getCurrentPosition(
        position => {
          this._location.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      );
  }

  public location(): Observable<Location> {
    return this._location;
  }
}
