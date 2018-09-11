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
  CameraService,
  CameraPickerComponent,
  StateService
} from './shared';

require('style-loader!./styles.scss');

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
    CameraService,
    StateService
  ],
  entryComponents: [
    CameraPickerComponent
  ]
})
export class AppExtrasModule {}
