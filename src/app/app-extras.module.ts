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
  CameraService,
  CameraPickerComponent,
  CameraInfoComponent,
  StateService,
  ThumbnailService
} from './shared';

import {
  AppSkyModule
} from './app-sky.module';

import {
  AppStacheModule
} from './app-stache.module';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzFkM3_X3RE1Yqboc0YlNUqSU_y8j2DD4'
    }),
    AgmSnazzyInfoWindowModule
  ],
  exports: [
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    AppSkyModule,
    AppStacheModule,
    CommonModule
  ],
  providers: [
    GoogleMapsAPIWrapper,
    CameraService,
    StateService,
    ThumbnailService
  ],
  entryComponents: [
    CameraPickerComponent,
    CameraInfoComponent
  ]
})
export class AppExtrasModule {}
