import {
  Component,
  Input
} from '@angular/core';

import {
  SkyAppConfig
} from '@blackbaud/skyux-builder/runtime';

import {
  CameraService,
  StateService
} from '../../services';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

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

  public get cssClass(): string {
    return 'command-' + this.config.runtime.command;
  }

  constructor(
    private config: SkyAppConfig,
    private cameraService: CameraService,
    private stateService: StateService
  ) {

    this.cameraService
      .getFeatures()
      .subscribe(data => {
        data.features.forEach((feature: any) => {
          feature.coordinates = {
            lat: parseFloat(feature.geometry.coordinates[1]),
            lng: parseFloat(feature.geometry.coordinates[0])
          };
        });
        this.features = data.features;
      });
  }

  public markerClick(feature: any) {
    feature.selected = !feature.selected;
    this.updateState();
  }

  // Ignore closed events until a real one is clicked
  public infoWindowClosed(feature: any) {
    if (feature && feature.selected) {
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
}
