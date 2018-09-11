import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import * as HLS from 'hls.js';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: [ './camera.component.scss' ]
})
export class CameraComponent implements AfterViewInit, OnDestroy {

  @Input()
  public feature: any;

  @Input()
  public id: any;

  @ViewChild('video')
  public videoRef: ElementRef;

  public error: string;

  private player: HLS = new HLS();

  private video: HTMLVideoElement;

  public ngAfterViewInit() {
    this.video = this.videoRef.nativeElement;

    this.video.addEventListener('canplay', () => this.videoReady());

    if (HLS.isSupported()) {
      this.player.loadSource(this.feature.properties.https_url);
      this.player.attachMedia(this.video);
      this.player.on(HLS.Events.ERROR, (e: any, data: any) => {
        this.error = e;
        console.error(e, data);
      });
    } else {
      this.video.controls = true;
      this.video.src = this.feature.properties.https_url;
    }
  }

  public ngOnDestroy() {
    this.player.detachMedia();
    this.player.destroy();
  }

  private videoReady() {
    this.error = undefined;
    this.video.play();
  }
}
