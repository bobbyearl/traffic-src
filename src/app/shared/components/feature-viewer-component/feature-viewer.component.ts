import {
  Component,
  Input,
  OnDestroy
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  SkyModalService
} from '@skyux/modals';

import {
  StateService
} from '../../services';

import {
  Mode,
  State
} from '../../models';

import {
  CameraInfoComponent
} from '../camera-info-component/camera-info.component';

import {
  CameraInfoContext
} from '../camera-info-component/camera-info.context';

@Component({
  selector: 'app-feature-viewer',
  templateUrl: './feature-viewer.component.html',
  styleUrls: ['./feature-viewer.component.scss']
})
export class FeatureViewerComponent implements OnDestroy {

  @Input()
  public feature: any;

  public modeIsStream = false;

  public modeIsThumb = false;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private modalService: SkyModalService,
    private stateService: StateService
  ) {
    this.subscriptions.push(
      this.stateService
      .get()
      .subscribe((state: State) => {
        this.modeIsStream = state.mode === Mode.STREAM;
        this.modeIsThumb = state.mode === Mode.THUMB;
      })
    );
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
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }
}
