import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IpLocation } from './shared/interfaces/location.interface';
import { environment } from '../../environment';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public inputValue: string = '';
  private ipV4AdressRegex: RegExp = /^(?:[0-9]{1,3}.){3}[0-9]{1,3}$/gm;

  private clientIpAddress: string = '';
  private firstLogin: boolean = true;

  private map!: L.Map;
  public locationData: IpLocation | undefined;

  private API_URL = environment.apiUrl;

  private customMarker = L.icon({
    iconUrl: 'assets/images/icon-location.svg',
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, 0],
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.map = L.map('map', { zoomControl: false });
    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      }
    ).addTo(this.map);
    this.getClientIpAddress();
  }

  private getClientIpAddress(): void {
    this.http
      .get('https://api.ipify.org?format=json')
      .subscribe((response: any) => {
        this.clientIpAddress = response.ip;
        if (this.clientIpAddress) {
          this.getIpAddressData(this.clientIpAddress);
        }
      });
  }

  private getIpAddressData(ipAddress: string): void {
    this.http
      .get<IpLocation>(this.API_URL + ipAddress)
      .subscribe((response) => {
        this.locationData = response;
        if (this.locationData.location) {
          this.setMapView(
            this.locationData.location.lat,
            this.locationData.location.lng
          );
        }
      });
  }

  private setMapView(x: number, y: number): void {
    this.map.setView([x, y], 16);

    if (this.firstLogin) {
      L.marker([x, y], { icon: this.customMarker })
        .addTo(this.map)
        .bindPopup('Your location')
        .openPopup();
      this.firstLogin = false;
    } else {
      L.marker([x, y], { icon: this.customMarker }).addTo(this.map);
    }
  }

  public getLocation(): void {
    if (this.inputValue.trim() && this.inputValue.match(this.ipV4AdressRegex)) {
      this.getIpAddressData(this.inputValue);
      this.inputValue = '';
    }
  }
}
