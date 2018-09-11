declare var google: any;

import { Component, OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';

@Component({
  selector: 'app-layer-traffic',
  templateUrl: './layer-traffic.component.html'
})
export class MapLayerTrafficComponent implements OnInit {

  constructor(private gmapsApi: GoogleMapsAPIWrapper) { }

  public ngOnInit() {
    this.gmapsApi.getNativeMap().then(map => {
      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map);
    });
  }
}
