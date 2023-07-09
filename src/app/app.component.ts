import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public inputValue: string = '';

  ngOnInit(): void {
    const map = L.map('map', { zoomControl: false }).setView(
      [48.8583, 2.2945],
      16
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
  }

  public logData(): void {
    console.log(this.inputValue);
    this.inputValue = '';
  }
}
