import {
  Component,
  Input,
  OnInit,
  OnChanges
} from '@angular/core';

import { SkyAppAssetsService } from '@blackbaud/skyux-builder/runtime/assets.service';
import { CameraService } from '../camera-service';

@Component({
  selector: 'be-camera-grid',
  templateUrl: './camera-grid.component.html'
})
export class CameraGridComponent implements OnInit, OnChanges {

  @Input()
  public section: string;

  public features: any = [];

  private sections: any = {
    '526E': [
      '60043',
      // '60044', Not working as of 2017-09-11
      '60042',
      '60025',
      '60026',
      '60027',
      '60028',
      '60029',
      // '60030', Not working as of 2017-09-11
      '60046',
      '60047'
      // '60048', Not working as of 2017-09-11
      // '60049', Not working as of 2017-09-11
      // '60050' Not working as of 2017-09-11
    ],
    '526W': [
      '60039',
      '60040',
      '60041',
      '60055',
      '60045',
      '60052',
      '60042',
      '60053'
    ],
    '26-outer': [
      '60002',
      '60003',
      '60004',
      '60005',
      '60006',
      '60007',
      '60008',
      '60096',
      '60097'
    ],
    '26-middle': [
      '60009',
      '60010',
      '60012',
      // 60013', Not working as of 2016-12-19
      '60014',
      '60015',
      '60016',
      '60017',
      '60018',
      '60019',
      '60020',
      '60021',
      '60022',
      '60023',
      '60024',
      '60095'
    ],
    '26-inner': [
      '60031',
      // 60032, Not working as of 2016-12-19
      '60033',
      '60034',
      '60036',
      '60037',
      '60038',
      '60058',
      '60060',
      '60061',
      '60062',
      '60063'
    ],
    'ravenel': [
      '60064',
      '60065',
      '60066',
      '60067',
      '60068',
      '60069',
      '60070',
      '60071'
    ]
  };

  private flashplayer: string;

  constructor(
    public cameraService: CameraService,
    private assets: SkyAppAssetsService
  ) {
    this.flashplayer = this.assets.getUrl('camera-overlay-js/jwplayer.flash.swf');
  }

  public ngOnInit() {}

  public ngOnChanges() {
    this.cameraService
    .getFeatures()
    .subscribe((data: any) => {
      this.features = data.features
        .filter((feature: any) => this.sections[this.section].includes(feature.id));
    });
  }
}
