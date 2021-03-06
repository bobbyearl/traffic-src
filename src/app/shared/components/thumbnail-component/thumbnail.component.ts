import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  ThumbnailService
} from '../../services';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements OnInit {

  @Input()
  public feature: any;

  public src: string;

  constructor(
    private thumbnailService: ThumbnailService
  ) {}

  public ngOnInit() {
    this.thumbnailService
      .getThumbnailById(this.feature.id)
      .subscribe((url: string) => {
        this.src = url;
      });
  }
}
