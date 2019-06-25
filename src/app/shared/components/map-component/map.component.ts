declare var google: any;

import {
  Component,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  first
} from 'rxjs/operators';

import {
  LatLngBounds,
  MapsAPILoader,
  AgmMap
} from '@agm/core';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  CameraService,
  StateService,
  LocationService
} from '../../services';

import {
  State,
  View
} from '../../models';

import {
  Location
} from '../../interfaces';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnDestroy {

  @Input()
  public selected: any;

  public features: any;

  public coordinates: any;

  public state: State;

  public zoom: number;

  public location: Location;

  public urlMarkerLocation: string;

  public urlMarkerFeature: string;

  // Type of LatLngBounds would be better, but...
  // https://github.com/SebastianM/angular-google-maps/issues/1530
  public selectedBounds: any = false;

  @ViewChild(AgmMap)
  private agmMap: AgmMap;

  private subscriptions: Array<Subscription> = [];

  private hasLoaded = false;

  private map: any;

  private firstIdleIgnored = false;

  private zoomLocation = 13;

  constructor(
    assetsService: SkyAppAssetsService,
    private mapsAPILoader: MapsAPILoader,
    private cameraService: CameraService,
    private stateService: StateService,
    private locationService: LocationService
  ) {

    this.urlMarkerFeature = assetsService.getUrl('marker_red.png');
    this.urlMarkerLocation = assetsService.getUrl('marker_blue.png');

    // Only load the state once, the map updates the state as a convenience afterwards.
    this.subscriptions.push(
      this.stateService
        .get()
        .pipe(first())
        .subscribe((state: State) => {
          this.state = state;
          this.zoom = state.zoom;
        })
    );

    this.subscriptions.push(
      this.locationService
        .location()
        .subscribe((location: Location) => {

          this.zoom = this.zoomLocation;
          this.location = location;

          // Courtesy if refreshed since state is ignored after first.
          this.stateService.set({
            zoom: this.zoom
          });

          // Yucky https://github.com/SebastianM/angular-google-maps/issues/987
          this.agmMap
            .triggerResize(true)
            .then(() => (this.agmMap as any)._mapsWrapper.setCenter({
              lat: location.lat,
              lng: location.lng
            }));
        })
    );

    this.subscriptions.push(
      this.cameraService
        .getFeatures()
        .subscribe(data => {
          this.mapsAPILoader
            .load()
            .then(() => {
              let bounds: LatLngBounds = new google.maps.LatLngBounds();
              let hasSelected = false;

              data.features.forEach((feature: any) => {
                if (feature.selected) {
                  bounds.extend(feature.coordinates);
                  hasSelected = true;
                }
              });

              if (hasSelected && !this.hasLoaded) {
                this.selectedBounds = bounds;
              }

              this.features = data.features;
              this.hasLoaded = true;
            });
          })
    );
  }

  public markerClick(feature: any) {
    feature.selected = !feature.selected;
    this.updateState();
  }

  // Ignores closed events if the view is changing
  public infoWindowClosed(feature: any) {
    if (this.state.view === View.MAP) {
      feature.selected = false;
      this.updateState();
    }
  }

  public updateState() {
    const selected = this.features
      .filter((f: any) => f.selected)
      .map((f: any) => f.id);

    this.stateService.set({
      selected
    });
  }

  public onMapReady(map: any) {
    this.map = map;
  }

  public onMapIdle() {
    if (!this.firstIdleIgnored) {
      this.firstIdleIgnored = true;
      return;
    }

    if (this.map) {
      this.stateService.set({
        lat: this.map.center.lat(),
        lng: this.map.center.lng(),
        zoom: this.map.zoom
      });
    }
  }

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }
}
