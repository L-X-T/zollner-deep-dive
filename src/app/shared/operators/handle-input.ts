import { debounceTime, distinctUntilChanged, filter, Observable, of, startWith, switchMap } from 'rxjs';

export function handleInput(minLength = 3, initialString = '', debounceTimeMs = 250) {
  return (source$: Observable<string>): Observable<string> => {
    return source$.pipe(
      filter((value) => value?.length >= minLength),
      startWith(initialString),
      debounceTime(debounceTimeMs),
      distinctUntilChanged()
    );
  };
}
