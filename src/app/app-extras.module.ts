import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClientModule
} from '@angular/common/http';

import {
  AgmCoreModule,
  GoogleMapsAPIWrapper
} from '@agm/core';

import {
  AgmSnazzyInfoWindowModule
} from '@agm/snazzy-info-window';

import {
  StacheModule
} from '@blackbaud/skyux-lib-stache';

import {
  CameraService,
  CameraPickerComponent,
  CameraInfoComponent,
  StateService,
  ThumbnailService,
  LocationService
} from './shared';

import {
  AppSkyModule
} from './app-sky.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzFkM3_X3RE1Yqboc0YlNUqSU_y8j2DD4'
    }),
    AgmSnazzyInfoWindowModule
  ],
  exports: [
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    AppSkyModule,
    StacheModule,
    CommonModule
  ],
  providers: [
    GoogleMapsAPIWrapper,
    CameraService,
    StateService,
    ThumbnailService,
    LocationService
  ],
  entryComponents: [
    CameraPickerComponent,
    CameraInfoComponent
  ]
})
export class AppExtrasModule {}
