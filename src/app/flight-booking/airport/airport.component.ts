import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { Observable, Observer, Subject, Subscription, takeUntil } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { AirportService } from './airport.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html',
  styleUrls: ['./airport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirportComponent implements OnDestroy {
  isLoading = true;
  airports: string[] = [];

  readonly airports$: Observable<string[]> = this.airportService.findAll().pipe(
    // map((airports) => []),
    delay(2000),
    share()
  );

  private readonly airportsObserver: Observer<string[]> = {
    next: (airports) => {
      console.log(airports);
      this.airports = airports;
      this.isLoading = false;
      this.cdr.markForCheck();
    },
    error: (err) => {
      this.isLoading = false;
      this.cdr.markForCheck();
      console.error(err);
    },
    complete: () => console.warn('complete!')
  };

  // var 1 subscription
  private airportsSubscription: Subscription = this.airports$.subscribe(this.airportsObserver);

  // var 2 takeUntil
  private readonly onDestroySubject = new Subject<void>();
  readonly terminator$ = this.onDestroySubject.asObservable();

  // var 2.16 super lean with injector
  readonly airportsSuperLean$: Observable<string[]> = inject(AirportService).findAll().pipe(
    // map((airports) => []),
    delay(2000),
    share(),
    takeUntilDestroyed()
  );

  constructor(private airportService: AirportService, private cdr: ChangeDetectorRef) {
    // var 2 takeUntil
    this.airports$.pipe(takeUntil(this.terminator$)).subscribe(this.airportsObserver); // same Observer as in var 1

    // var 2.16 takeUntilDestroyed
    this.airports$.pipe(takeUntilDestroyed()).subscribe(this.airportsObserver); // same Observer as in var 1
  }

  ngOnDestroy(): void {
    // var 1 subscription
    this.airportsSubscription?.unsubscribe();

    // var 2 takeUntil
    this.onDestroySubject.next(void 0);
    this.onDestroySubject.complete();
  }
}
