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
  State,
  View
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

  public get cssClassByView() {
    return `app-feature-wrapper-${this.view}`;
  }

  public modeIsStream = false;

  public modeIsThumb = false;

  public selected: Array<any> | undefined = [];

  private view: View | undefined;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private modalService: SkyModalService,
    private stateService: StateService
  ) {
    this.subscriptions.push(
      this.stateService
      .get()
      .subscribe((state: State) => {
        this.selected = state.selected;
        this.view = state.view;
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

  public close() {
    this.stateService.set({
      selected: this.selected?.filter((id: string) => id !== this.feature.properties.id)
    });
  }

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }
}
