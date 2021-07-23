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

  public src: string | undefined;

  constructor(
    private thumbnailService: ThumbnailService
  ) {}

  public ngOnInit() {
    this.thumbnailService
      .getThumbnailByFeature(this.feature)
      .subscribe((url: string) => {
        this.src = url;
      });
  }
}
