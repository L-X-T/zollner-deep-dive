import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  apiUrl = 'https://demo.angulararchitects.io/api/Airport';

  constructor(private httpClient: HttpClient) {}

  findAll(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.apiUrl);
  }
}