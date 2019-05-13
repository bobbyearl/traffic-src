declare var google: any;

import {
  Component,
  Input,
  OnDestroy
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  LatLngBounds,
  MapsAPILoader
} from '@agm/core';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  CameraService,
  StateService
} from '../../services';

import {
  State,
  View
} from '../../models';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnDestroy {

  @Input()
  public selected: any;

  @Input()
  public lat: number;

  @Input()
  public lng: number;

  @Input()
  public zoom: number;

  public features: any;
  public coordinates: any;

  // Type of LatLngBounds would be better, but...
  // https://github.com/SebastianM/angular-google-maps/issues/1530
  public selectedBounds: LatLngBounds;

  public get cssClass(): string {
    return 'command-' + this.config.runtime.command;
  }

  private state: State;
  private subscriptions: Array<Subscription> = [];
  private hasLoaded = false;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private config: SkyAppConfig,
    private cameraService: CameraService,
    private stateService: StateService
  ) {
    this.subscriptions.push(
      this.stateService
        .get()
        .subscribe((state: State) => this.state = state)
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

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }
}
