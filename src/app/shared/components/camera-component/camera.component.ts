import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import * as HLS from 'hls.js';

import {
  ThumbnailService
} from '../../services';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: [ './camera.component.scss' ]
})
export class CameraComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  public feature: any;

  @ViewChild('video')
  public videoRef: ElementRef;

  public error: string;

  public poster: string;

  public isLoading = true;

  private player: HLS = new HLS();

  private video: HTMLVideoElement;

  constructor(
    private thumbnailService: ThumbnailService
  ) { }

  public ngOnInit() {
    this.thumbnailService
      .getThumbnailById(this.feature.id)
      .subscribe((url: string) => {
        this.poster = url;
      });
  }

  // Use AfterViewInit so we can reference nativeElement
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

  public ngOnDestroy() {
    this.video.pause();
    this.video.removeAttribute('src'); // empty source
    this.video.load();
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
