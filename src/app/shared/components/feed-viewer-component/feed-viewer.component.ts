import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  SkyFlyoutInstance,
  SkyFlyoutService,
  SkyWaitService,
  SkyMediaQueryService,
  SkyMediaBreakpoints,
  SkyConfirmInstance,
  SkyConfirmService,
  SkyConfirmType
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
  public views = [
    {
      name: 'View as cards',
      icon: 'table',
      value: View.CARDS
    },
    {
      name: 'View as list',
      icon: 'list',
      value: View.LIST
    },
    {
      name: 'View as map',
      icon: 'map-marker',
      value: View.MAP
    }
  ];

  private flyout: SkyFlyoutInstance<CameraPickerComponent>;
  private subscriptions: Array<Subscription> = [];

  constructor (
    private flyoutService: SkyFlyoutService,
    private stateService: StateService,
    private mediaQueryService: SkyMediaQueryService,
    private cameraService: CameraService,
    private waitService: SkyWaitService,
    private confirmService: SkyConfirmService
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

          this.views.forEach((v: any) => {
            v.active = v.value === state.view;
          });

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
              this.setView(View.CARDS);
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

  // Confirm switching to map view if multiple selected
  public setView(view: View) {
    if (view === View.MAP && this.hasSelected && this.selected.length > 1) {

      const dialog: SkyConfirmInstance = this.confirmService.open({
        message: 'Confirm Map View',
        body: `You currently have ${this.selected.length} cameras selected.`,
        type: SkyConfirmType.YesCancel
      });

      dialog.closed.subscribe((result: any) => {
        if (result.action === 'yes') {
          this.updateState(view);
        }
      });

    } else {
      this.updateState(view);
    }
  }

  public updateState(view: View) {
    this.stateService.set({
      view
    });
  }

  public launchCameraSelector() {
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

  // Convience method used when no cameras selected
  public launchMapView() {
    this.setView(View.MAP);
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
