import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-camera-grid',
  templateUrl: './camera-grid.component.html',
  styleUrls: ['./camera-grid.component.scss']
})
export class CameraGridComponent {

  @Input()
  public features: Array<any> = [];

  @Input()
  public columnWidth: string;

  public camerasPluralMapping = {
    '=0' : '0 cameras',
    '=1' : '1 camera',
    'other' : '# cameras'
  };
}
