import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {
  SkyAppConfig
} from '@blackbaud/skyux-builder/runtime';

import * as HLS from 'hls.js';
import * as URI from 'urijs';

let cameraCounter = 0;

@Component({
  selector: 'be-camera',
  templateUrl: './camera.component.html',
  styleUrls: [ './be-camera.component.scss' ]
})
export class CameraComponent implements AfterViewInit, OnDestroy {

  @Input()
  public feature: any;

  private _player: HLS;

  public get player(): HLS {
    this._player = this._player || new HLS();
    return this._player;
  }

  public id: string = 'cam-' + cameraCounter++;

  constructor(
    private skyAppConfig: SkyAppConfig
  ) { }

  public ngAfterViewInit() {
    const video = <HTMLVideoElement>document.querySelector(`#${this.id}`);
    const uri = new URI(this.feature.properties.http_url);

    if (this.skyAppConfig.skyux.appSettings['useProxy']) {
      const origin = uri.origin();
      const directory = uri.directory() + '/';
      uri.origin(this.skyAppConfig.skyux.appSettings['proxy']);
      uri.setQuery('origin', origin);
      uri.setQuery('directory', directory);
    }

    if (HLS.isSupported()) {
      this.player.loadSource(uri.toString());
      this.player.attachMedia(video);
    } else {
      console.log('Not supported.  :-(');
    }

    this.player.on(HLS.Events.MANIFEST_PARSED, () => {
      video.play();
    });

    this.player.on(HLS.Events.ERROR, (e: any, data: any) => {
      console.error(data);
      // console.error(e);
    });
  }

  public ngOnDestroy() {
    this.player.detachMedia();
    this.player.destroy();
  }
}
