import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  SkyFlyoutInstance,
  SkyFlyoutService,
  SkyWaitService,
  SkyMediaQueryService,
  SkyMediaBreakpoints
} from '@blackbaud/skyux/dist/core';

import {
  Observable,
  Subscription
} from 'rxjs';

import {
  CameraService,
  StateService
} from '../../services';

import {
  CameraPickerComponent
} from '../camera-picker-component/camera-picker.component';

import {
  CameraPickerContext
} from '../camera-picker-component/camera-picker.context';

import {
  View,
  State
} from '../../models';

@Component({
  selector: 'app-feed-viewer',
  templateUrl: './feed-viewer.component.html',
  styleUrls: ['./feed-viewer.component.scss']
})
export class FeedViewerComponent implements OnDestroy {

  public selected: Array<any> = [];
  public regions: Array<any> = [];

  public view: View;
  public routeKeys: any;

  public viewIsMap = false;
  public viewIsCardsOrList = false;
  public canGetLocation = false;
  public isMobileBreakpoint = true;
  public hasSelected = false;
  public columnWidth = 3;
  public lat = 34.009967;
  public lng = -81.050091;
  public zoom = 8;
  public error: string;

  private flyout: SkyFlyoutInstance<CameraPickerComponent>;

  private subscriptions: Array<Subscription> = [];

  constructor (
    private flyoutService: SkyFlyoutService,
    private stateService: StateService,
    private mediaQueryService: SkyMediaQueryService,
    private cameraService: CameraService,
    private waitService: SkyWaitService
  ) {
    this.routeKeys = cameraService.getRouteKeys();
    const $regions = cameraService.getFeatures();
    const $selected = cameraService.getSelectedFeatures();

    this.waitService.beginBlockingPageWait();
    this.subscriptions.push(
      Observable.combineLatest($regions, $selected)
        .subscribe((subscriptions: any) => {
          this.regions = subscriptions[0].regions;
          this.selected = subscriptions[1];
          this.hasSelected = this.selected && this.selected.length > 0;
          this.waitService.endBlockingPageWait();
        })
    );

    this.subscriptions.push(
      this.stateService
        .get()
        .subscribe((state: State) => {

          this.error = undefined;
          this.viewIsCardsOrList = false;
          this.viewIsMap = false;
          this.view = state.view;

          switch (state.view) {
            case View.MAP:
              this.viewIsMap = true;
              break;

            case View.CARDS:
              this.viewIsCardsOrList = true;
              this.columnWidth = 3;
              break;

            case View.LIST:
              this.viewIsCardsOrList = true;
              this.columnWidth = 12;
              break;

            case undefined:
              this.viewChanged(View.CARDS);
              break;

            default:
              this.error = 'Unknown view';
          }
        })
    );

    this.subscriptions.push(
      this.mediaQueryService
        .subscribe((breakpoint: SkyMediaBreakpoints) => {
          this.isMobileBreakpoint = breakpoint === SkyMediaBreakpoints.xs;
        })
    );

    if (window.navigator && window.navigator.geolocation) {
      this.canGetLocation = true;
    }
  }

  public viewChanged(view: View) {
    this.stateService.set({
      view
    });
  }

  public launchCameraPicker() {
    this.flyout = this.flyoutService.open(CameraPickerComponent, {
      defaultWidth: 400,
      providers: [{
        provide: CameraPickerContext,
        useValue: {
          regions: this.regions,
          selected: this.selected
        }
      }]
    });

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }

  public setMapView() {
    this.view = View.MAP;
    this.viewChanged(View.MAP);
  }

  public clearSelected() {
    this.stateService.set({ selected: [] });
  }

  public routeClick(route: string) {
    this.stateService.set({
      selected: this.cameraService.getRouteIds(route)
    });
  }

  public getMyLocation() {
    window.navigator.geolocation.getCurrentPosition(
      position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 13;
      }
    );
  }

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }
}
