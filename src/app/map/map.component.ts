import { Component } from '@angular/core';
import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';
import { CameraService } from '../shared/camera-service';

@Component({
  selector: 'be-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  public lat: number = 34.009967;
  public lng: number = -81.050091;
  public features: any;
  public coordinates: any;

  public get cssClass(): string {
    return 'command-' + this.config.runtime.command;
  }

  constructor(
    private config: SkyAppConfig,
    private cameraService: CameraService
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
    if (feature.enabled) {
      feature.disable();
    } else {
      feature.enable();
    }
  }
}
