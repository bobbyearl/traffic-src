import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  combineLatest,
  Subscription
} from 'rxjs';

import {
  CameraService,
  StateService
} from '../../services';

import 'rxjs/add/operator/merge';

@Component({
  selector: 'app-camera-picker',
  templateUrl: './camera-picker.component.html',
  styleUrls: [ './camera-picker.component.scss' ]
})
export class CameraPickerComponent implements OnInit, OnDestroy {

  public isWaiting = true;
  public isDirty = false;
  public selected: Array<any> = [];
  public regions: Array<any> = [];
  public features: Array<any> = [];
  public searchResults: Array<any> = [];
  public searchText: string;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private cameraService: CameraService,
    private stateService: StateService
  ) { }

  public ngOnInit() {
    const $combined = combineLatest([
      this.cameraService.getFeatures(),
      this.cameraService.getSelectedFeatures()
    ]);

    this.subscriptions.push(
      $combined.subscribe((subscriptions: any) => {
        // Cheating the UI.  Huge delay without this.
        setTimeout(() => {
          this.regions = subscriptions[0].regions;
          this.features = subscriptions[0].features;
          this.selected = subscriptions[1];

          this.updateSelectedCount();
          this.isWaiting = false;
        }, 0);
      })
    );
  }

  public featureSelected(feature: any) {
    this.isDirty = true;
  }

  public searchApplied(searchText: string) {
    const searchTextLowerCase = searchText.toLowerCase();
    this.searchText = searchText;
    this.searchResults = !searchText ? [] : this.features
      .filter((feature: any) =>
        feature.id.indexOf(searchTextLowerCase) > -1 ||
        feature.properties.title.toLowerCase().indexOf(searchTextLowerCase) > -1
      );
  }

  public updateSelectedCount() {
    this.regions.forEach((region: any) => {
      const selectedInRegion = region.features
        .filter((feature: any) => feature.selected)
        .map((feature: any) => feature.id);
      region.selectedCount = selectedInRegion.length;
    });
  }

  public applySelected() {
    const selected = this.features
      .filter((f: any) => f.selected)
      .map((f: any) => f.id);

    this.stateService.set({
      selected
    });
  }

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }
}
