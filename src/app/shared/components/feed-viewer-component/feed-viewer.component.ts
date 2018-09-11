import {
  Component
} from '@angular/core';

import {
  SkyFlyoutInstance,
  SkyFlyoutService,
  SkyWaitService
} from '@blackbaud/skyux/dist/core';

import {
  Observable
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
export class FeedViewerComponent {

  public selected: Array<any> = [];
  public regions: Array<any> = [];

  public view: View;
  public viewIsMap = false;
  public viewIsCardsOrList = false;
  public canGetLocation = false;
  public columnWidth = 3;
  public lat = 34.009967;
  public lng = -81.050091;
  public zoom = 8;
  public error: string;

  private flyout: SkyFlyoutInstance<CameraPickerComponent>;

  constructor (
    private flyoutService: SkyFlyoutService,
    private stateService: StateService,
    waitService: SkyWaitService,
    cameraService: CameraService
  ) {
    const $regions = cameraService.getFeatures();
    const $selected = cameraService.getSelectedFeatures();

    waitService.beginBlockingPageWait();
    Observable.zip($regions, $selected)
      .subscribe((subscriptions: any) => {
        this.regions = subscriptions[0].regions;
        this.selected = subscriptions[1];
        waitService.endBlockingPageWait();
      });

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
      });

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
    this.viewChanged(View.MAP);
  }

  public clearSelected() {
    this.stateService.set({ selected: [] });
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
}
