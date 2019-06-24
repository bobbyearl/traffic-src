import {
  NgModule
} from '@angular/core';

import {
  SkyHeroModule
} from '@blackbaud/skyux-lib-media';

import {
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyFlyoutModule
} from '@skyux/flyout';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyAlertModule,
  SkyIconModule,
  SkyWaitModule
} from '@skyux/indicators';

import {
  SkyToolbarModule,
  SkyActionButtonModule,
  SkyDefinitionListModule,
  SkyFluidGridModule
} from '@skyux/layout';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkySearchModule
} from '@skyux/lookup';

import {
  SkyConfirmModule,
  SkyModalModule
} from '@skyux/modals';

import {
  SkyDropdownModule
} from '@skyux/popovers';

@NgModule({
  exports: [
    SkyActionButtonModule,
    SkyAlertModule,
    SkyCheckboxModule,
    SkyConfirmModule,
    SkyDefinitionListModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyFlyoutModule,
    SkyHeroModule,
    SkyIconModule,
    SkyMediaQueryModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkyToolbarModule,
    SkyWaitModule
  ]
})
export class AppSkyModule { }
