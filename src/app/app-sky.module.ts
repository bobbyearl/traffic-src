import {
  NgModule
} from '@angular/core';

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
  SkyWaitModule,
  SkyAlertModule
} from '@skyux/indicators';

import {
  SkyToolbarModule,
  SkyFluidGridModule,
  SkyActionButtonModule,
  SkyDefinitionListModule
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

require('style-loader!@skyux/theme/css/sky.css');

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
    SkyMediaQueryModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkyToolbarModule,
    SkyWaitModule
  ]
})
export class AppSkyModule { }
