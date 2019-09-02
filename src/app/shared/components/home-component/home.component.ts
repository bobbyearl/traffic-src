import {
  Component
} from '@angular/core';

import {
  StateService
} from '../../services';

import {
  Mode,
  Density,
  View
} from '../../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public dorianThumbnailsFragment: string;

  constructor(
    stateService: StateService
  ) {
    this.dorianThumbnailsFragment = stateService.getStateLink({
      mode: Mode.THUMB,
      density: Density.SM,
      selected: [
        '10019',
        '10101',
        '10102',
        '10103',
        '10105',
        '10106',
        '10107',
        '10108',
        '10123',
        '10124',
        '10125',
        '10126',
        '10127',
        '10128',
        '10129',
        '10130',
        '10131',
        '10132',
        '10133',
        '10134',
        '10135',
        '10136',
        '10137',
        '10138',
        '10140',
        '10141',
        '10142',
        '10143',
        '10144',
        '10145',
        '10177',
        '10200',
        '11018',
        '60002',
        '60003',
        '60004',
        '60005',
        '60007',
        '60008',
        '60009',
        '60010',
        '60012',
        '60013',
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
        '60036',
        '60037',
        '60095',
        '60096',
        '60108',
        '60109'
      ],
      view: View.CARDS
    });
  }
 }
