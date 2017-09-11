import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { SkyAppAssetsService } from '@blackbaud/skyux-builder/runtime/assets.service';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { CameraService } from '../camera-service';

declare var CameraOverlay: any;

@Component({
  selector: 'be-camera-layer',
  templateUrl: './camera-layer.component.html'
})
export class CameraLayerComponent implements OnInit {

  @Input()
  public feature: any;

  private layer: any;
  private flashplayer: string;
  private iconDisabled: string;
  private iconEnabled: string;

  constructor(
    private gmapsApi: GoogleMapsAPIWrapper,
    private cameraService: CameraService,
    private assets: SkyAppAssetsService
  ) {
    this.flashplayer = this.assets.getUrl('camera-overlay-js/jwplayer.flash.swf');
    this.iconDisabled = this.assets.getUrl('pink-dot.png');
    this.iconEnabled = this.assets.getUrl('blue-dot.png');
  }

  public ngOnInit() {
    this.gmapsApi.getNativeMap().then((map) => {
      this.cameraService.init().then(() => {

        this.layer = new CameraOverlay({
          camera: this.feature,
          flashplayer: this.flashplayer,
          onClose: () => {
            this.feature.disable();
          }
        });

        this.layer.setMap(map);
        this.feature.icon = this.iconDisabled;

        this.feature.enable = () => {
          this.layer.enable();
          this.feature.icon = this.iconEnabled;
          this.feature.enabled = true;
        };

        this.feature.disable = () => {
          this.layer.disable();
          this.feature.icon = this.iconDisabled;
          this.feature.enabled = false;
        };

      });
    });
  }
}
