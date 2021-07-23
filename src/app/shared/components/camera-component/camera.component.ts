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
  public videoRef: ElementRef | undefined;

  public error: string | undefined;

  public poster: string | undefined;

  public isLoading = true;

  private player: HLS = new HLS();

  private video: HTMLVideoElement | undefined;

  private errorCounter = 0;

  private MAX_ERROR_COUNT = 0;

  constructor(
    private thumbnailService: ThumbnailService
  ) { }

  public ngOnInit() {
    this.thumbnailService
      .getThumbnailByFeature(this.feature)
      .subscribe((url: string) => {
        this.poster = url;
      });
  }

  // Use AfterViewInit so we can reference nativeElement
  public ngAfterViewInit() {
    if (this.videoRef && this.videoRef.nativeElement) {
      this.video = this.videoRef.nativeElement;

      this.video!.addEventListener('canplay', () => this.videoReady());
      this.video!.addEventListener('playing', () => this.clearError());
      this.video!.addEventListener('error', (e: any) => this.showError(e));

      if (HLS.isSupported()) {
        this.player.loadSource(this.feature.properties.https_url);
        this.player.attachMedia(this.video!);

        this.player.on(HLS.Events.ERROR, (e: 'hlsError', data: HLS.errorData) => {
          if (!data.fatal) {
            return;
          }

          switch (data.type) {
            case HLS.ErrorTypes.NETWORK_ERROR:
              if (!this.showError(e, data)) {
                this.player.startLoad();
              }
              break;
            case HLS.ErrorTypes.MEDIA_ERROR:
              if (!this.showError(e, data)) {
                this.player.recoverMediaError();
              }
              break;
            default:
              this.showError(e, data);
              this.player.destroy();
              break;
          }
        });
      } else {
        this.video!.controls = true;
        this.video!.src = this.feature.properties.https_url;
      }
    }
  }

  public ngOnDestroy() {
    this.video!.pause();
    this.video!.removeAttribute('src'); // empty source
    this.video!.load();
    this.player.detachMedia();
    this.player.destroy();
  }

  private videoReady() {
    this.clearError();
    this.video!.play();
    this.isLoading = false;
  }

  private showError(err: string, data?: any): boolean {
    if (this.errorCounter++ < this.MAX_ERROR_COUNT) {
      return true;
    }

    this.isLoading = false;
    this.error = err;
    console.error(err);

    if (data) {
      console.error(data);
    }

    return false;
  }

  private clearError() {
    this.error = undefined;
  }
}
