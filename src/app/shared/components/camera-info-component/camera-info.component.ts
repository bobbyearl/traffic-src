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
  View, Mode
} from '../../models';

@Component({
  selector: 'app-camera-info',
  templateUrl: './camera-info.component.html',
  styleUrls: ['./camera-info.component.scss']
})
export class CameraInfoComponent {

  public id: string;

  public properties: any;

  public fragmentForListViewStreaming: string;

  public fragmentForMapViewStreaming: string;

  public fragmentForListViewThumbnail: string;

  public fragmentForMapViewThumbnail: string;

  constructor (
    public context: CameraInfoContext,
    public instance: SkyModalInstance,
    stateService: StateService
  ) {
    const { id, properties, geometry } = context.feature;

    this.fragmentForListViewStreaming = stateService.getStateLink({
      selected: [id],
      view: View.LIST,
      mode: Mode.STREAM
    });

    this.fragmentForMapViewStreaming = stateService.getStateLink({
      selected: [id],
      view: View.MAP,
      mode: Mode.STREAM
    });

    this.fragmentForListViewThumbnail = stateService.getStateLink({
      selected: [id],
      view: View.LIST,
      mode: Mode.THUMB
    });

    this.fragmentForMapViewThubmnail = stateService.getStateLink({
      selected: [id],
      view: View.MAP,
      mode: Mode.THUMB
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
