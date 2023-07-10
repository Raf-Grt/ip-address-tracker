import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;

  private customMarker = L.icon({
    iconUrl: 'assets/images/icon-location.svg',
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, 0],
  });

  constructor() {}

  /**
   * Create the Leaflet map.
   * @param elementId The ID of the HTML element to render the map.
   * @param options The options for configuring the map.
   */
  createMap(elementId: string, options: L.MapOptions): void {
    this.map = L.map(elementId, options);
  }

  /**
   * Add a tile layer to the map.
   * @param url The URL of the tile layer.
   * @param options The options for configuring the tile layer.
   */
  addTileLayer(
    url: string = 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
    options: L.TileLayerOptions = {
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }
  ): void {
    L.tileLayer(url, options).addTo(this.map);
  }

  /**
   * Set the view of the map to the specified coordinates and zoom level.
   * @param lat The latitude coordinate.
   * @param lng The longitude coordinate.
   * @param zoom The zoom level (default: 16).
   */
  setView(lat: number, lng: number, zoom: number = 16): void {
    this.map.setView([lat, lng], zoom);
  }

  /**
   * Add a marker to the map at the specified coordinates.
   * @param lat The latitude coordinate.
   * @param lng The longitude coordinate.
   * @param options The options for configuring the marker (default: using customMarker icon).
   * @returns The created marker object.
   */
  addMarker(
    lat: number,
    lng: number,
    options: L.MarkerOptions = { icon: this.customMarker }
  ): L.Marker {
    const marker = L.marker([lat, lng], options).addTo(this.map);
    return marker;
  }
}
