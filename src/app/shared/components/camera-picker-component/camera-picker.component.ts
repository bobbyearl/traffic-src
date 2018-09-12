import {
  Component,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  CameraPickerContext
} from './camera-picker.context';

import {
  StateService
} from '../../services';

import {
  State
} from '../../models';

@Component({
  selector: 'app-camera-picker',
  templateUrl: './camera-picker.component.html',
  styleUrls: [ './camera-picker.component.scss' ]
})
export class CameraPickerComponent implements AfterViewInit, OnDestroy {

  public regions: Array<any> = [];
  private state: State;
  private subscriptions: Array<Subscription> = [];
  public isWaiting = true;

  constructor(
    public context: CameraPickerContext,
    private stateService: StateService
  ) { }

  public ngAfterViewInit() {
    this.regions = this.context.regions;
    this.subscriptions.push(
      this.stateService
      .get()
      .subscribe((state: State) => {
        this.state = state;
        this.updateSelectedCount();
        this.isWaiting = false;
      })
    );
  }

  public featureSelected(feature: any) {
    let selected = this.state.selected
      ? this.state.selected.slice()
      : [];

    if (feature.selected) {
      selected.push(feature.id);
    } else {
      selected = selected.filter((id: string) => id !== feature.id);
    }

    this.stateService.set({
      selected
    });
  }

  public updateSelectedCount() {
    this.regions.forEach((region: any) => {
      const selectedInRegion = region.features
        .filter((feature: any) => feature.selected)
        .map((feature: any) => feature.id);
      region.selectedCount = selectedInRegion.length;
    });
  }

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }
}
