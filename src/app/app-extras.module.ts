import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  AgmCoreModule,
  GoogleMapsAPIWrapper
} from '@agm/core';

import {
  AgmSnazzyInfoWindowModule
} from '@agm/snazzy-info-window';

import {
  HttpClientModule
} from '@angular/common/http';

import {
  CameraService,
  CameraPickerComponent,
  CameraInfoComponent,
  StateService
} from './shared';

import {
  AppSkyModule
} from './app-sky.module';

require('style-loader!./styles.scss');

@NgModule({
  imports: [
    AppSkyModule,
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzFkM3_X3RE1Yqboc0YlNUqSU_y8j2DD4'
    }),
    AgmSnazzyInfoWindowModule,
    HttpClientModule
  ],
  exports: [
    AppSkyModule,
    AppSkyModule,
    CommonModule,
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
