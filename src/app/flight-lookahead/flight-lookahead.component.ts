import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  filter,
  interval,
  map,
  merge,
  Observable,
  of,
  pairwise,
  retry,
  startWith,
  Subject,
  switchMap,
  tap
} from 'rxjs';
import { Flight } from '../flight-booking/flight';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { handleInput } from '../shared/operators/handle-input';

@Component({
  selector: 'app-flight-lookahead',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-lookahead.component.html',
  styleUrls: ['./flight-lookahead.component.scss']
})
export class FlightLookaheadComponent {
  fromControl = new FormControl('', { nonNullable: true });
  toControl = new FormControl('', { nonNullable: true });

  flights$: Observable<Flight[]> | undefined;
  diff$: Observable<number> | undefined;
  isLoading = false;

  online$: Observable<boolean> | undefined;

  private refreshClickSubject = new Subject<void>();
  readonly refreshClick$ = this.refreshClickSubject.asObservable();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    /*this.control = new FormControl();
    const input$ = this.control.valueChanges.pipe(debounceTime(300));*/

    const fromInput$ = this.fromControl.valueChanges.pipe(handleInput());
    const toInput$ = this.toControl.valueChanges.pipe(handleInput());

    /*this.flights$ = this.control.valueChanges.pipe(
      debounceTime(300),
      filter((input) => input.length > 2),
      distinctUntilChanged(),
      tap((i) => (this.isLoading = true)),
      switchMap((input) => this.load(input)),
      tap((v) => (this.isLoading = false))
    );*/

    this.online$ = interval(2000).pipe(
      startWith(0),
      // map((_) => Math.random() < 0.5),
      map((_) => true), // deactivated online flag
      distinctUntilChanged()
    );

    const combined$ = combineLatest([fromInput$, toInput$, this.online$]).pipe(
      distinctUntilChanged(
        (x: [from: string, to: string, online: boolean], y: [from: string, to: string, online: boolean]) => x[0] === y[0] && x[1] === y[1]
      )
    );
    const refresh$: Observable<[string, string, boolean]> = this.refreshClick$.pipe(
      map((_) => [this.fromControl.value, this.toControl.value, true])
    );

    this.flights$ = merge(combined$, refresh$).pipe(
      filter(([f, t, online]) => !!(f || t) && online),
      map(([f, t, _]) => [f, t]),
      // distinctUntilChanged((x: [from: string, to: string], y: [from: string, to: string]) => x[0] === y[0] && x[1] === y[1]),
      tap(([f, t]) => (this.isLoading = true)),
      switchMap(([from, to]) =>
        this.load(from, to).pipe(
          retry(3), // you retry 3 times
          catchError((err) => {
            console.log('Error caught:');
            console.log(err);
            return of([]);
          }) // if all fail catch error
        )
      ),
      tap((a) => (this.isLoading = false))
    );

    this.diff$ = this.flights$.pipe(
      pairwise(),
      map(([a, b]) => b.length - a.length)
    );
  }

  load(from: string, to: string = ''): Observable<Flight[]> {
    const url = 'http://www.angular.at/api/flight';
    const params = new HttpParams().set('from', from).set('to', to);
    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, { params, headers });
  }

  refresh(): void {
    this.refreshClickSubject.next(void 0);
  }
}
