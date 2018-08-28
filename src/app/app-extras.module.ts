import {
  NgModule
} from '@angular/core';

import {
  StacheModule
} from '@blackbaud/stache';

import {
  AgmCoreModule,
  GoogleMapsAPIWrapper
} from '@agm/core';

import {
  CameraService
} from './shared/camera-service';

require('style-loader!./styles.scss');
require('./lib/jwplayer-7.12.6/jwplayer.js');

declare var jwplayer: any;
jwplayer.key = 'WDUy49wQ8ai4pO/+8zTHaPFaqb9HsctrEoBlFw==';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    StacheModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzFkM3_X3RE1Yqboc0YlNUqSU_y8j2DD4'
    })
  ],
  exports: [
    StacheModule,
    AgmCoreModule
  ],
  providers: [
    GoogleMapsAPIWrapper,
    CameraService
  ]
})
export class AppExtrasModule {}
