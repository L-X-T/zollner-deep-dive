import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FlightService } from '../../flight-booking/flight.service';

export const validateAsyncMulti =
  (flightService: FlightService): AsyncValidatorFn =>
  (c: AbstractControl): Observable<ValidationErrors | null> => {
    const group: FormGroup = c as FormGroup; // type cast

    const from = group.controls['from']?.value;
    const to = group.controls['to']?.value;

    if (!from || !to) {
      return of(null);
    }

    return flightService.find(from, to).pipe(
      map((flights) =>
        flights.length > 0
          ? null
          : {
              asyncMulti: {
                from,
                to
              }
            }
      ),
      delay(2000) // <-- delay; can be removed later...
    );
  };
