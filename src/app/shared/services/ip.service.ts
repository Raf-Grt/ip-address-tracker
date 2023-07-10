import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IpLocation } from '../interfaces/location.interface';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class IpService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get the client's IP address.
   * @returns An observable that emits the client's IP address.
   */
  getClientIpAddress(): Observable<string> {
    return this.http.get('https://api.ipify.org?format=json').pipe(
      map((response: any) => {
        return response.ip;
      })
    );
  }

  /**
   * Get the location data for the specified IP address.
   * @param ipAddress The IP address to get the location data for.
   * @returns An observable that emits the location data.
   */
  getIpAddressData(ipAddress: string): Observable<IpLocation> {
    const url = this.API_URL + ipAddress;

    return this.http.get<IpLocation>(url);
  }
}
