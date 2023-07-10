import { Component, OnInit } from '@angular/core';

import { IpService } from './shared/services/ip.service';
import { MapService } from './shared/services/map.service';

import { IpLocation } from './shared/interfaces/location.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public inputValue: string = '';
  private ipV4AdressRegex: RegExp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/gm;

  private clientIpAddress: string = '';
  private firstLogin: boolean = true;

  public locationData: IpLocation | undefined;
  public errorMessage: string = '';

  constructor(private ipService: IpService, private mapService: MapService) {}

  ngOnInit(): void {
    // Create the Leaflet map
    this.mapService.createMap('map', { zoomControl: false });
    // Add the tile layer to the map
    this.mapService.addTileLayer();
    // Retrieve the client's IP address
    this.getClientIpAddress();
  }

  private getClientIpAddress(): void {
    // Use the IpService to retrieve the client's IP address
    this.ipService.getClientIpAddress().subscribe((clientIp: string) => {
      this.clientIpAddress = clientIp;
      if (this.clientIpAddress) {
        // Get the location data for the IP address
        this.getIpAddressData(this.clientIpAddress);
      }
    });
  }

  private getIpAddressData(ipAddress: string): void {
    // Use the IpService to get the location data for the specified IP address
    this.ipService.getIpAddressData(ipAddress).subscribe(
      (response: IpLocation) => {
        this.locationData = response;
        if (this.locationData.location) {
          // Set the map view to the specified location coordinates
          this.setMapView(
            this.locationData.location.lat,
            this.locationData.location.lng
          );
        }
      },
      (error: any) => {
        this.errorMessage =
          'Error occurred while fetching location data. Try again later';
      }
    );
  }

  private setMapView(x: number, y: number): void {
    // Set the map view to the specified coordinates
    this.mapService.setView(x, y);

    if (this.firstLogin) {
      // Add a marker to the map with a popup for the first login
      this.mapService.addMarker(x, y).bindPopup('Your location').openPopup();
      this.firstLogin = false;
    } else {
      // Simply add a marker to the map
      this.mapService.addMarker(x, y);
    }
  }

  public getLocation(): void {
    if (this.inputValue.trim() && this.inputValue.match(this.ipV4AdressRegex)) {
      // Get the location data for the specified IP address in input
      this.getIpAddressData(this.inputValue);
      this.inputValue = '';
    } else {
      this.errorMessage = 'Please, use a valid IPv4 address.';
    }
  }
}
