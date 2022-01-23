// src/app/flight-booking/flight-booking.routes.ts

import { Routes } from '@angular/router';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';

// Diesen Import hinzufügen
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { AirportComponent } from './airport/airport.component';
import { FlightBookingComponent } from './flight-booking.component';
import { authGuard } from '../shared/auth/auth.guard';
import { canDeactivateGuard } from '../shared/deactivation/can-deactivate.guard';
import { FlightResolver } from './flight.resolver';

export const FLIGHT_BOOKING_ROUTES: Routes = [
  {
    path: 'flight-booking',
    redirectTo: 'flight-booking/flight-search',
    pathMatch: 'full'
  },
  {
    path: 'flight-booking',
    component: FlightBookingComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'airports',
        component: AirportComponent
      },
      {
        path: 'flight-search',
        component: FlightSearchComponent
      },
      {
        path: 'passenger-search',
        component: PassengerSearchComponent
      },
      {
        path: 'flight-edit/:id',
        component: FlightEditComponent,
        canDeactivate: [canDeactivateGuard],
        resolve: {
          flight: FlightResolver
        }
      }
    ]
  }
];
