import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Flight } from './flight';

import { DefaultFlightService } from './default-flight.service';

@Injectable({
  providedIn: 'root',
  useClass: DefaultFlightService,
  // useFactory: (http: HttpClient) => (environment.production ? new DefaultFlightService(http) : new DummyFlightService(http)),
  deps: [HttpClient]
})
export abstract class FlightService {
  url = 'http://www.angular.at/api/flight';

  flights: Flight[] = [];
  readonly flightsSubject = new BehaviorSubject<Flight[]>([]);
  readonly flights$ = this.flightsSubject.asObservable();

  protected constructor(public http: HttpClient) {}

  load(from: string, to: string): void {
    const unhandledSubscription = this.find(from, to).subscribe({
      next: (flights) => {
        this.flightsSubject.next(flights);
        this.flights = flights;
      },
      error: (err) => {
        console.error('Error loading flights', err);
      }
    });
  }

  delay(): void {
    const ONE_MINUTE = 1000 * 60;
    const oldFlights = this.flights;
    const oldFlight = oldFlights[0];
    const oldDate = new Date(oldFlight.date);

    // Mutable
    // oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE);
    // oldFlight.date = oldDate.toISOString();

    // Immutable
    const newDate = new Date(oldDate.getTime() + 15 * ONE_MINUTE);
    const newFlight: Flight = { ...oldFlight, date: newDate.toISOString() };
    const newFlights = [newFlight, ...oldFlights.slice(1)];
    this.flightsSubject.next(newFlights);
    this.flights = newFlights;

    // Alternatives
    // this.flights.splice(0, 1, newFlight);
    // this.flights = this.flights.map((f, i) => (i === 0 ? newFlight : f));
  }

  abstract find(from: string, to: string): Observable<Flight[]>;

  abstract findById(id: string): Observable<Flight>;

  abstract save(flight: Flight): Observable<Flight>;
}
