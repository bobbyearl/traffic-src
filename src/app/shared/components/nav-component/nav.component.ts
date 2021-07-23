import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  combineLatest,
  Subscription
} from 'rxjs';

import {
  SkyConfirmInstance,
  SkyConfirmService,
  SkyConfirmType
} from '@skyux/modals';

import {
  Mode,
  NavPane,
  State,
  View,
  Route
} from '../../models';

import {
  LocationService,
  StateService,
  ThumbnailService,
  CameraService,
  NavService
} from '../../services';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnDestroy {
  public views = [
    {
      active: false,
      name: 'View as cards',
      icon: 'table',
      value: View.CARDS
    },
    {
      active: false,
      name: 'View as map',
      icon: 'globe',
      value: View.MAP
    }
  ];

  public modes = [
    {
      active: false,
      name: 'Video streams',
      icon: 'video-camera',
      value: Mode.STREAM
    },
    {
      active: false,
      name: 'Thumbnails',
      icon: 'camera',
      value: Mode.THUMB
    }
  ];

  public routes: any;

  public isLocationAvailable = false;
  public isLocationLoading = false;
  public isMobile = false;
  public showRefreshThumbnails = false;
  public showExpandedText = false;
  public isMobileShowMenu = false;

  public selectedCount = 0;

  // Expose our enums to the template
  public View = View;
  public Mode = Mode;
  public NavPane = NavPane;

  public state: State = {};
  private subscriptions: Array<Subscription> = [];

  constructor (
    private skyConfirmService: SkyConfirmService,
    private cameraService: CameraService,
    private locationService: LocationService,
    private navService: NavService,
    private stateService: StateService,
    private thumbnailService: ThumbnailService
  ) {
    // this.routes = cameraService.getRoutes();
    this.subscriptions.push(
      this.cameraService
        .getRoutes()
        .subscribe((routes: Route[]) => this.routes = routes)
    );

    const $combined = combineLatest([
      this.navService.isMobile(),
      this.stateService.get()
    ]);

    this.subscriptions.push(
      $combined.subscribe((subscriptions: any) => {
        this.isMobile = subscriptions[0];
        this.state = subscriptions[1];

        this.selectedCount = this.state.selected ? this.state.selected.length : 0;
        this.showExpandedText = this.isMobile || this.state.navPane === NavPane.EXPANDED;
        this.showRefreshThumbnails = this.selectedCount > 0 && this.state.mode === Mode.THUMB;

        this.views.forEach((v: any) => {
          v.active = v.value === this.state.view;
        });

        this.modes.forEach((m: any) => {
          m.active = m.value === this.state.mode;
        });
      })
    );

    this.subscriptions.push(
      this.locationService
        .location()
        .subscribe(() => {
          this.isLocationLoading = false;
        })
    );

    if (window.navigator && window.navigator.geolocation) {
      this.isLocationAvailable = true;
    }
  }

  public btnClickGetLocation() {
    this.btnClickMobileMenu();
    this.isLocationLoading = true;
    this.locationService.get();
  }

  public btnClickClearSelected() {
    this.btnClickMobileMenu();
    this.stateService.set({ selected: [] });
  }

  public btnClickRefreshThumbnails() {
    this.btnClickMobileMenu();
    this.thumbnailService.refresh();
  }

  public btnClickMobileMenu() {
    this.isMobileShowMenu = !this.isMobileShowMenu;
  }

  public btnClickToggleNavPane() {
    this.stateService.set({
      navPane: this.state.navPane === NavPane.EXPANDED ? NavPane.COLLAPSED : NavPane.EXPANDED
    });
  }

  public btnClickSetView(view: View) {
    const message = this.selectedCount > 0
      ? `You currently have ${this.selectedCount} cameras selected.`
      : ``;

    const conditional = view === View.MAP
      && this.state.mode !== Mode.THUMB
      && this.selectedCount > CameraService.maximumMapCameraWarning;

    this.confirmMapView(conditional || false, message, ((mode?: Mode) => {
      this.btnClickMobileMenu();
      this.stateService.set({
        selected: this.state.selected,
        view,
        mode
      });
    }));
  }

  public btnClickSetMode(mode: Mode) {
    this.btnClickMobileMenu();
    this.stateService.set({
      mode
    });
  }

  public btnClickLaunchCameraSelector() {
    this.cameraService.launchCameraSelector();
  }

  public btnClickRoute(route: Route) {

    const message = `This will enable ${route.ids.length} cameras.`;
    const conditional = this.state.view === View.MAP
      && this.state.mode !== Mode.THUMB
      && route.ids.length > CameraService.maximumMapCameraWarning;

    this.confirmMapView(conditional, message, (mode: Mode) => {
      this.btnClickMobileMenu();
      this.stateService.set({
        selected: route.ids,
        mode
      });
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
      const dialog: SkyConfirmInstance = this.skyConfirmService.open({
        message: 'Confirm Map View',
        body: [
          message,
          `Viewing more than ${CameraService.maximumMapCameraWarning} streaming cameras on the map at a time can be resource intensive.`,
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
