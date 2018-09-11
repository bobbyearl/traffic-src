import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-camera-grid',
  templateUrl: './camera-grid.component.html'
})
export class CameraGridComponent {

  @Input()
  public features: Array<any> = [];

  @Input()
  public columnWidth: string;
}
