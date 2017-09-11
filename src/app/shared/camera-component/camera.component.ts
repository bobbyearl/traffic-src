import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { SkyAppAssetsService } from '@blackbaud/skyux-builder/runtime/assets.service';

declare var jwplayer: any;

@Component({
  selector: 'be-camera',
  templateUrl: './camera.component.html'
})
export class CameraComponent implements AfterViewInit, OnDestroy {

  @Input()
  public feature: any;

  private flashplayer: string;
  private _player: any;

  public get player(): any {
    this._player = this._player || jwplayer(this.elementRef.nativeElement);
    return this._player;
  }

  constructor(
    private elementRef: ElementRef,
    private assets: SkyAppAssetsService
  ) {
    this.flashplayer = this.assets.getUrl('camera-overlay-js/jwplayer.flash.swf');
  }

  public ngAfterViewInit() {
    this.player.setup({
      flashplayer: this.flashplayer,
      controls: false,
      aspectratio: '4:3',
      width: '100%',
      stretching: 'fill',
      playlist: [{
        sources: [
          { file: this.feature.properties.rtmp_url },
          { file: this.feature.properties.http_url }
        ]
      }]
    }).on('ready', function() {
      this.play();
    });
  }

  public ngOnDestroy() {
    this.player.remove();
  }
}
