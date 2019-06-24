import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkyFlyoutInstance,
  SkyFlyoutService
} from '@skyux/flyout';

import {
  SkyWaitService
} from '@skyux/indicators';

import {
  SkyConfirmInstance,
  SkyConfirmService,
  SkyConfirmType
} from '@skyux/modals';

import {
  Subscription,
  combineLatest
} from 'rxjs';

import {
  CameraService,
  StateService,
  ThumbnailService,
  LocationService
} from '../../services';

import {
  CameraPickerComponent
} from '../camera-picker-component/camera-picker.component';

import {
  View,
  State,
  Mode,
  NavPane
} from '../../models';

@Component({
  selector: 'app-feed-viewer',
  templateUrl: './feed-viewer.component.html',
  styleUrls: ['./feed-viewer.component.scss']
})
export class FeedViewerComponent implements OnDestroy {

  public selected: Array<any> = [];
  public regions: Array<any> = [];
  public features: Array<any> = [];
  public routeKeys: any;
  public viewIsMap = false;
  public viewIsCardsOrList = false;
  public modeIsThumb = false;
  public canGetLocation = false;
  public isMobileBreakpoint = true;
  public isNavPaneOpen = false;
  public hasSelected = false;
  public columnWidth = 3;
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

  public modes = [
    {
      name: 'Video streams',
      icon: 'retweet',
      value: Mode.STREAM
    },
    {
      name: 'Thumbnails',
      icon: 'camera',
      value: Mode.THUMB
    }
  ];

  public get cssClass(): string {
    return 'command-' + this.config.runtime.command;
  }

  private flyout: SkyFlyoutInstance<CameraPickerComponent>;
  private subscriptions: Array<Subscription> = [];
  private maximumMapCameraWarning = 4;

  constructor (
    private flyoutService: SkyFlyoutService,
    private mediaQueryService: SkyMediaQueryService,
    private waitService: SkyWaitService,
    private confirmService: SkyConfirmService,
    private cameraService: CameraService,
    private stateService: StateService,
    private thumbnailService: ThumbnailService,
    private locationService: LocationService,
    private config: SkyAppConfig
  ) {
    this.routeKeys = cameraService.getRouteKeys();
    const $combined = combineLatest([
      cameraService.getFeatures(),
      cameraService.getSelectedFeatures()
    ]);

    this.waitService.beginBlockingPageWait();
    this.subscriptions.push(
      $combined.subscribe((subscriptions: any) => {
        this.regions = subscriptions[0].regions;
        this.features = subscriptions[0].features;
        this.selected = subscriptions[1];

        this.hasSelected = this.selected && this.selected.length > 0;

        if (this.hasSelected) {
          const joined = this.selected
            .map((selected: any) => selected.id)
            .sort()
            .join();

          this.routeKeys.forEach((route: any) => {
            route.active = route.joined === joined;
          });
        }

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
          this.modeIsThumb = state.mode === Mode.THUMB;
          this.isNavPaneOpen = state.navPane === NavPane.EXPANDED;

          this.views.forEach((v: any) => {
            v.active = v.value === state.view;
          });

          this.modes.forEach((m: any) => {
            m.active = m.value === state.mode;
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

  public setView(view: View) {
    const message = this.hasSelected
      ? `You currently have ${this.selected.length} cameras selected.`
      : ``;
    const conditional = view === View.MAP
      && !this.modeIsThumb
      && this.hasSelected
      && this.selected.length > this.maximumMapCameraWarning;

    this.confirmMapView(conditional, message, ((mode?: Mode) => {
      this.stateService.set({
        view,
        mode
      });
    }));
  }

  public setMode(mode: Mode) {
    this.stateService.set({
      mode
    });
  }

  public launchCameraSelector() {
    this.flyout = this.flyoutService
      .open(CameraPickerComponent, { defaultWidth: 400 });

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

  public refresh() {
    this.thumbnailService.refresh();
  }

  public routeClick(route: string) {
    const selected = this.cameraService.getRouteIds(route);
    const conditional = this.viewIsMap
      && !this.modeIsThumb
      && selected.length > this.maximumMapCameraWarning;
    const message = `This will enable ${selected.length} cameras.`;

    this.confirmMapView(conditional, message, (mode: Mode) => {
      this.stateService.set({
        selected,
        mode
      });
    });
  }

  public getMyLocation() {
    this.locationService.get();
  }

  public toggleNavPane() {
    const s = this.isNavPaneOpen ? NavPane.COLLAPSED : NavPane.EXPANDED;
    this.stateService.set({
      navPane: s
    });
  }

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }

  /**
   * Switching to a map view with lots of cameras can be rough.
   * This if factored to handle coming from common routes or view switcher.
   * @param conditional
   * @param message
   * @param callback
   */
  private confirmMapView(conditional: boolean, message: string, callback: Function) {
    if (conditional) {
      const dialog: SkyConfirmInstance = this.confirmService.open({
        message: 'Confirm Map View',
        body: [
          message,
          `Viewing more than ${this.maximumMapCameraWarning} streaming cameras on the map at a time can be resource intensive.`,
          `Modern systems handle this fine.  For older or mobile devices, you may consider using Thumbnail Mode.`
        ].join('  '),
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'Proceed',
            action: 'proceed',
            autofocus: true,
            styleType: 'primary'
          },
          {
            text: 'Use Thumbnails',
            action: 'thumbs',
            styleType: 'secondary'
          },
          {
            text: 'Cancel',
            action: 'cancel',
            styleType: 'link'
          }
        ]
      });

      dialog.closed.subscribe((result: any) => {
        switch (result.action) {
          case 'proceed':
            callback();
            break;

          case 'thumbs':
            callback(Mode.THUMB);
            break;

          default:
        }

      });
    } else {
      callback();
    }
  }
}
