import {
  Component,
  Input,
  OnDestroy
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  StateService
} from '../../services';

import {
  State,
  View
} from '../../models';

@Component({
  selector: 'app-camera-grid',
  templateUrl: './camera-grid.component.html',
  styleUrls: ['./camera-grid.component.scss']
})
export class CameraGridComponent implements OnDestroy {

  @Input()
  public features: Array<any> = [];

  public camerasPluralMapping = {
    '=0' : '0 cameras',
    '=1' : '1 camera',
    'other' : '# cameras'
  };


  public state: State;

  public View = View;

  private subscriptions: Array<Subscription> = [];

  constructor (
    private stateService: StateService
  ) {
    this.subscriptions.push(
      this.stateService
        .get()
        .subscribe((state: State) => this.state = state)
    );
  }

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }
}
