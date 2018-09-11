import {
  Component
} from '@angular/core';

import {
  CameraPickerContext
} from './camera-picker.context';

import {
  StateService
} from '../../services';

@Component({
  selector: 'app-camera-picker',
  templateUrl: './camera-picker.component.html',
  styleUrls: [ './camera-picker.component.scss' ]
})
export class CameraPickerComponent {

  public regions: Array<any> = [];

  constructor(
    public context: CameraPickerContext,
    private stateService: StateService
  ) {
    this.regions = context.regions;
    this.updateSelectedCount();
  }

  public featureSelected() {
    const selected: Array<string> = [];

    this.regions.forEach((region: any) => {
      const selectedInRegion = region.features
        .filter((feature: any) => feature.selected)
        .map((feature: any) => feature.id);
      selected.push(...selectedInRegion);
    });

    this.updateSelectedCount();

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
}
