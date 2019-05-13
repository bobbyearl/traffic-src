import {
  NgModule
} from '@angular/core';

import {
  StacheWrapperModule,
  StachePageSummaryModule,
  StacheCodeModule,
  StacheIncludeModule,
  StacheLayoutModule,
  StachePageAnchorModule,
  StacheBlockquoteModule,
  StacheTutorialModule
} from '@blackbaud/skyux-lib-stache';

@NgModule({
  exports: [
    StacheBlockquoteModule,
    StacheCodeModule,
    StacheIncludeModule,
    StacheLayoutModule,
    StachePageAnchorModule,
    StachePageSummaryModule,
    StacheTutorialModule,
    StacheWrapperModule
  ]
})
export class AppStacheModule { }