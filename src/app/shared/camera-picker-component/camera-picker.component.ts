import {
  Component,
  OnInit
} from '@angular/core';

import {
  CameraService
} from '../camera-service';

@Component({
  selector: 'be-camera-picker',
  templateUrl: './camera-picker.component.html'
})
export class CameraPickerComponent implements OnInit {
  public features: any;

  constructor(
    private cameraService: CameraService
  ) {
    this.cameraService
      .getFeatures()
      .subscribe((data: any) => {
        this.features = data;
      });
  }

  public ngOnInit() {

  }
}
