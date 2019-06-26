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
  AgmJsMarkerClustererModule
} from '@agm/js-marker-clusterer';

import {
  AgmSnazzyInfoWindowModule
} from '@agm/snazzy-info-window';

import {
  StacheModule
} from '@blackbaud/skyux-lib-stache';

import {
  AppSkyModule
} from './app-sky.module';

import {
  CameraService,
  CameraSelectorComponent,
  CameraInfoComponent,
  LocationService,
  NavService,
  StateService,
  ThumbnailService
} from './shared';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzFkM3_X3RE1Yqboc0YlNUqSU_y8j2DD4'
    }),
    AgmJsMarkerClustererModule,
    AgmSnazzyInfoWindowModule
  ],
  exports: [
    AgmCoreModule,
    AgmJsMarkerClustererModule,
    AgmSnazzyInfoWindowModule,
    AppSkyModule,
    StacheModule,
    CommonModule
  ],
  providers: [
    GoogleMapsAPIWrapper,
    CameraService,
    LocationService,
    NavService,
    StateService,
    ThumbnailService
  ],
  entryComponents: [
    CameraSelectorComponent,
    CameraInfoComponent
  ]
})
export class AppExtrasModule {}
