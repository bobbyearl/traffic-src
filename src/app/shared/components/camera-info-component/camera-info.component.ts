import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@blackbaud/skyux/dist/core';

import {
  CameraInfoContext
} from './camera-info.context';

import {
  StateService
} from '../../services';

import {
  View
} from '../../models';

@Component({
  selector: 'app-camera-info',
  templateUrl: './camera-info.component.html',
  styleUrls: ['./camera-info.component.scss']
})
export class CameraInfoComponent {

  public id: string;

  public properties: any;

  public fragmentForListView: string;

  public fragmentForMapView: string;

  constructor (
    public context: CameraInfoContext,
    public instance: SkyModalInstance,
    stateService: StateService
  ) {
    const { id, properties, geometry } = context.feature;

    this.fragmentForListView = stateService.getStateLink({
      selected: [id],
      view: View.LIST
    });

    this.fragmentForMapView = stateService.getStateLink({
      selected: [id],
      view: View.MAP
    });

    this.id = id;
    this.properties = [
      {
        key: 'Region',
        value: properties['region']
      },
      {
        key: 'Description',
        value: properties['title']
      },
      {
        key: 'Direction',
        value: properties['route_direction']
      },
      {
        key: 'Coordinates',
        value: geometry.coordinates.join(', ')
      }
    ];
  }
}
