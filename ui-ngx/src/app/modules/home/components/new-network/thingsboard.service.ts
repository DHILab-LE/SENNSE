///
/// Copyright © 2016-2025 ${ISPC Lecce | CNR}
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThingsBoardService {
  private baseUrl = 'http://150.145.56.26:4200/api';
  private jwtToken = localStorage.getItem('jwt_token') || '';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${this.jwtToken}`
    });
  }

  createDevice(deviceName: string): Observable<any> {
    const url = `${this.baseUrl}/device`;
    const deviceData = { name: deviceName, type: 'default' };
    return this.http.post(url, deviceData, { headers: this.getHeaders() });
  }

  getDeviceCredentials(deviceId: string): Observable<any> {
    const url = `${this.baseUrl}/device/${deviceId}/credentials`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  publishTelemetry(deviceToken: string, telemetryData: any): Observable<any> {
    const url = `${this.baseUrl}/v1/${deviceToken}/telemetry`;
    return this.http.post(url, telemetryData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

    // Method to send the email payload to ThingsBoard
    sendEmailData(payload: any): Observable<any> {
      const url = `${this.baseUrl}/plugins/telemetry/DEVICE/${payload.deviceId}/SHARED_SCOPE`;
      return this.http.post(url, payload, { headers: this.getHeaders() });
    }
  
}
