import {
  Component
} from '@angular/core';

import {
  State, View
} from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private map: any = {
    '526E': [
      '60043',
      '60044',
      '60042',
      '60025',
      '60026',
      '60027',
      '60028',
      '60029',
      '60030',
      '60046',
      '80004',
      '80005',
      '60047',
      '60048',
      '60049',
      '60050'
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
      '60095'
    ],
    '26-inner': [
      '60031',
      '60032',
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

  public sections = Object.keys(this.map);

  constructor (
    private router: Router
  ) {}

  public goToSection(section: string) {
    const state = new State({
      selected: this.map[section],
      view: View.MAP
    });

    this.router.navigate(['/feeds/scdot'], {
      fragment: JSON.stringify(state)
    });
  }

  public getStateForSection(section: string) {
    const state = new State({
      selected: this.map[section]
    });

    return JSON.stringify(state);
  }
}
