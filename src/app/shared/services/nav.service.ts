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

  private _isNavPaneVisible = new BehaviorSubject<boolean>(true);
  private _isMobile = new BehaviorSubject<boolean>(false);

  constructor(
    skyMediaQueryService: SkyMediaQueryService
  ) {
    skyMediaQueryService.subscribe((skyMediaBreakpoint: SkyMediaBreakpoints) => {
      this._isNavPaneVisible.next(skyMediaBreakpoint !== SkyMediaBreakpoints.xs);
      this._isMobile.next(skyMediaBreakpoint === SkyMediaBreakpoints.xs);
    });
  }

  public toggleNavPaneVisible() {
    this._isNavPaneVisible.next(!this._isNavPaneVisible.getValue());
  }

  public isNavPaneVisible(): Observable<boolean> {
    return this._isNavPaneVisible;
  }

  public isMobile(): Observable<boolean> {
    return this._isMobile;
  }
}
