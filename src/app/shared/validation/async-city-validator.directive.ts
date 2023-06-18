import { Directive } from '@angular/core';
import { AsyncValidator, NG_ASYNC_VALIDATORS } from '@angular/forms';

import { FlightService } from '../../flight-booking/flight.service';
import { validateAsyncCity } from './async-city-validator';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[asyncCity]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: AsyncCityValidatorDirective,
      multi: true
    }
  ]
})
export class AsyncCityValidatorDirective implements AsyncValidator {
  constructor(private flightService: FlightService) {}

  validate = validateAsyncCity(this.flightService);
}
