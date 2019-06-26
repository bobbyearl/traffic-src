import {
  Injectable
} from '@angular/core';

import {
  Observable,
  BehaviorSubject
} from 'rxjs';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

@Injectable()
export class NavService {

  private _isNavPaneVisible = new BehaviorSubject<Boolean>(true);

  constructor(
    skyMediaQueryService: SkyMediaQueryService
  ) {
    skyMediaQueryService.subscribe((skyMediaBreakpoint: SkyMediaBreakpoints) => {
      this._isNavPaneVisible.next(skyMediaBreakpoint !== SkyMediaBreakpoints.xs);
    });
  }

  public toggleNavPaneVisible() {
    this._isNavPaneVisible.next(!this._isNavPaneVisible.getValue());
  }

  public isNavPaneVisible(): Observable<Boolean> {
    return this._isNavPaneVisible;
  }
}
