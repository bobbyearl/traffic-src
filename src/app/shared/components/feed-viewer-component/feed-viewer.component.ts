import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  SkyMediaQueryService,
  SkyMediaBreakpoints
} from '@skyux/core';

import {
  SkyWaitService
} from '@skyux/indicators';

import {
  Subscription,
  combineLatest
} from 'rxjs';

import {
  CameraService,
  StateService
} from '../../services';

import {
  View,
  State,
  Mode
} from '../../models';

@Component({
  selector: 'app-feed-viewer',
  templateUrl: './feed-viewer.component.html',
  styleUrls: ['./feed-viewer.component.scss']
})
export class FeedViewerComponent implements OnDestroy {

  public selected: Array<any> = [];
  public regions: Array<any> = [];
  public features: Array<any> = [];
  public state: State;

  // Expose our enums to the template
  public View = View;
  public Mode = Mode;

  public error: string;

  public isMobile: boolean;

  public isServing = false;

  private subscriptions: Array<Subscription> = [];

  constructor (
    private skyMediaQueryService: SkyMediaQueryService,
    private skyWaitService: SkyWaitService,
    private stateService: StateService,
    private config: SkyAppConfig,
    private cameraService: CameraService
  ) {

    this.isServing = this.config.runtime.command === 'serve';

    const $combined = combineLatest([
      cameraService.getFeatures(),
      cameraService.getSelectedFeatures()
    ]);

    this.skyWaitService.beginBlockingPageWait();

    this.subscriptions.push(
      $combined.subscribe((subscriptions: any) => {
        this.regions = subscriptions[0].regions;
        this.features = subscriptions[0].features;
        this.selected = subscriptions[1];
        this.skyWaitService.endBlockingPageWait();
      })
    );

    this.subscriptions.push(
      this.skyMediaQueryService
        .subscribe((skyMediaBreakpoint: SkyMediaBreakpoints) => {
          this.isMobile = skyMediaBreakpoint === SkyMediaBreakpoints.xs;
        })
    );

    this.subscriptions.push(
      this.stateService
        .get()
        .subscribe((state: State) => {
          this.state = state;
        })
    );
  }

  // Convience method used when no cameras selected
  public btnClickLaunchMapView() {
    this.stateService.set({
      selected: [],
      view: View.MAP
    });
  }

  public btnClickLaunchCameraSelector() {
    this.cameraService.launchCameraSelector();
  }

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }
}
