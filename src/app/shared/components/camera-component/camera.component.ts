import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import {
  SkyModalService
} from '@blackbaud/skyux/dist/core';

import {
  CameraInfoComponent
} from '../camera-info-component/camera-info.component';

import {
  CameraInfoContext
} from '../camera-info-component/camera-info.context';

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

  public isLoading = true;

  private player: HLS = new HLS();

  private video: HTMLVideoElement;

  constructor(
    private modalService: SkyModalService
  ) {}

  public ngAfterViewInit() {
    this.video = this.videoRef.nativeElement;

    this.video.addEventListener('canplay', () => this.videoReady());
    this.video.addEventListener('playing', () => this.clearError());
    this.video.addEventListener('error', (e: any) => this.showError(e));

    if (HLS.isSupported()) {
      this.player.loadSource(this.feature.properties.https_url);
      this.player.attachMedia(this.video);
      this.player.on(HLS.Events.ERROR, (e: any, data: any) => this.showError(e, data));
    } else {
      this.video.controls = true;
      this.video.src = this.feature.properties.https_url;
    }
  }

  public showInfo() {
    this.modalService.open(CameraInfoComponent, {
      providers: [
        {
          provide: CameraInfoContext,
          useValue: {
            feature: this.feature
          }
        }
      ]
    });
  }

  public ngOnDestroy() {
    this.player.detachMedia();
    this.player.destroy();
  }

  private videoReady() {
    this.clearError();
    this.video.play();
    this.isLoading = false;
  }

  private showError(err: string, data?: any) {
    this.isLoading = false;
    this.error = err;
    console.error(err);

    if (data) {
      console.error(data);
    }
  }

  private clearError() {
    this.error = undefined;
  }
}
