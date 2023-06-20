import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FlightService } from '../../flight-booking/flight.service';

export const validateAsyncCity =
  (flightService: FlightService): AsyncValidatorFn =>
  (c: AbstractControl): Observable<ValidationErrors | null> =>
    flightService.find(c.value, '').pipe(
      map((flights) => (flights.length > 0 ? null : { asyncCity: { value: c.value } })),
      delay(2000) // <-- delay; can be removed later...
    );
