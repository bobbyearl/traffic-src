import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss']
})
export class AppNavComponent {
  public nav = [
    {
      name: 'Traffic',
      path: '/'
    },
    {
      name: 'Map',
      path: '/map'
    },
    {
      name: 'Charleston',
      path: '/region/charleston',
      nav: [
        {
          name: '526 E',
          path: '/region/charleston/526E'
        },
        {
          name: '526 W',
          path: '/region/charleston/526W'
        },
        {
          name: '26 Outer',
          path: '/region/charleston/26-outer'
        },
        {
          name: '26 Middle',
          path: '/region/charleston/26-middle'
        },
        {
          name: '26 Inner',
          path: '/region/charleston/26-inner'
        },
        {
          name: 'Ravenel Bridge',
          path: '/region/charleston/ravenel'
        }
      ]
    }
    // },
    // {
    //   name: 'My Cameras',
    //   path: '/my'
    // }
  ];
}
