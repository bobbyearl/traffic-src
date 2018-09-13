import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  StacheModule
} from '@blackbaud/stache';

import {
  AgmCoreModule,
  GoogleMapsAPIWrapper
} from '@agm/core';

import {
  AgmSnazzyInfoWindowModule
} from '@agm/snazzy-info-window';

import {
  CameraService,
  CameraPickerComponent,
  CameraInfoComponent,
  StateService
} from './shared';

require('style-loader!./styles.scss');

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    CommonModule,
    StacheModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzFkM3_X3RE1Yqboc0YlNUqSU_y8j2DD4'
    }),
    AgmSnazzyInfoWindowModule
  ],
  exports: [
    CommonModule,
    StacheModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule
  ],
  providers: [
    GoogleMapsAPIWrapper,
    CameraService,
    StateService
  ],
  entryComponents: [
    CameraPickerComponent,
    CameraInfoComponent
  ]
})
export class AppExtrasModule {}
