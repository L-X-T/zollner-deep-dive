# Reactive Forms

* [Reactive Forms](#reactive-forms)
	* [Edit flights *](#edit-flights-)
	* [Using Angular Validators *](#using-angular-validators-)

## Edit flights *

In this exercise, you will create a reactive form for editing flights.

Caution: This lab assumes you already know some basics and thus is a bit more difficult and some things are left out intentionally ;-)

1. **If** you do not have a ``FlightEditComponent`` yet: Create a ``FlightEditComponent`` in the ``FlightBookingModule`` and call it up in the template of the ``FlightSearchComponent``.

2. Import the ``ReactiveFormsModule`` into your ``FlightBookingModule``.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    [...]
    import { ReactiveFormsModule } from '@angular/forms';
    [...]

    @NgModule({
      [...]
      imports: [
        [...]
        ReactiveFormsModule
      ],
      [...]
    })
    export class FlightBookingModule {}
    ```

    </p>
    </details>

3. Add a FormGroup with the name ``editForm`` to your ``FlightEditComponent``.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    [...]
    import { FormGroup } from '@angular/forms';

    @Component({ [...] })
    export class FlightEditComponent {
      @Input({ required: true }) flight?: Flight | null;

      editForm: FormGroup;

      message = '';

      [...]
    }
    ```

    </p>
    </details>


4. Inject the FormBuilder into the ``FlightEditComponent``.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    import {[...], FormBuilder} from '@angular/forms';

    @Component({
      [...]
    })
    export class FlightEditComponent {
      [...]
   
      constructor(private fb: FormBuilder) {}
   
      [...]
    }
    ```

    </p>
    </details>


5. Use the ``FormsBuilder`` to create a ``FormGroup`` that describes a flight. Add this to the ``editForm``.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    export class FlightEditComponent {
      @Input({ required: true }) flight?: Flight | null;
   
      editForm = this.fb.group({
        id: [0],
        from: [''],
        to: [''],
        date: [''] // there are better ways to handle dates, but we'll keep things easy here
      });
   
      message = '';
      
      [...]
    }
    ```

    </p>
    </details>


6. With the code completion of your IDE/editor, explore the methods of editForm. For demonstration, output the properties ``value``, ``valid``, ``touched`` and ``dirty`` on the console.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript

    export class FlightEditComponent {
      [...]  
   
      constructor(private fb: FormBuilder) {
        console.log(this.editForm.value);
        console.log(this.editForm.valid);
        console.log(this.editForm.touched);
        console.log(this.editForm.dirty);
      }
   
      [...]
    }
    ```

    </p>
    </details>

7. Make sure you update the form value when the ``flight`` member is changed. You can use the lifecycle method ``ngOnChanges`` and the ``patchValue()`` of the ``FormGroup`` object. You might also need to add the import of the ``OnChanges`` interface.

    <details>
    <summary>Show source</summary>
    <p>
    
    ```typescript
    export class FlightEditComponent implements OnChanges {
        [...]
   
        ngOnChanges(): void {
          if (this.flight) {
             this.editForm.patchValue({ ...this.flight });
          }
        }
   
        [...]
    }
    ```
    
    </p>
    </details>

8. Register for ``valueChanges`` on your ``editForm`` and output the received value on the console in order to keep up to date with changes to the form. Please note: If you cannot see any debug messages in your DevTools Console, please make sure you checked "Verbose" in your "Default Levels" settings.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    export class FlightEditComponent {
        [...]
   
        constructor(private fb: FormBuilder) {
          [...]
          
          this.editForm.valueChanges.subscribe((value) => {
            console.debug('valueChanges: ', value);
          });
        }
   
        [...]
    }
    ```

    </p>
    </details>

**Please note** that later you should also add a subscription management (e.g. unsubscribe in ngOnDestroy) here.

9. Now switch to the file ``flight-edit.component.html``. Create a form there that you can link to the ``FormGroups`` in the ``editForm`` property.

    <details>
    <summary>Show source</summary>
    <p>

    ```html
    <form [formGroup]="editForm">
      <div class="form-group">
        <label>Id:</label>
        <input formControlName="id" class="form-control">
      </div>
   
      <div class="form-group">
        <label>From:</label>
        <input formControlName="from" class="form-control">
      </div>

      <div class="form-group">
        <label>To:</label>
        <input formControlName="to" class="form-control">
      </div>

      <div class="form-group">
        <label>Date:</label>
        <input formControlName="date" class="form-control">
      </div>

      <div class="form-group">
        <button class="btn btn-default">Save</button>
      </div>
    </form>
    ```

    </p>
    </details>

10. Test your solution. If everything works, you should see every change you make to the form in the console output.

**Please note** if you cannot see your `FlightEditComponent`, don't forget to add id, e.g. to the `SearchFormComponent` at the bottom. If you cannot see any debug messages in your `DevTools Console`, please make sure you checked `Verbose` in your browsers `Default Levels` settings.

11. You might want to implement the save() function. Add a click handler on the button, inject the flight service and call it's save method and then show a success / or error message to the user.

## Using Angular Validators *

In this exercise you will validate the _from_ field with the built-in validators ``required`` and ``minlength``.

1. Switch to the flight-edit.component.ts file and specify when setting up the FormGroup that the from property is to be validated with ``required`` and ``minlength``. The latter validator is intended to ensure that at least three characters are recorded.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript		
    editForm = this.fb.group({
      id: [0, Validators.required],
      from: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      to: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      date: ['', [Validators.required, Validators.minLength(33), Validators.maxLength(33)]]
    });
    ```

    </p>
    </details>

2. Switch to the ``flight-edit.component.html`` file and enter the ``errors`` property of the ``from`` control there. You can use the built-in json pipe.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    <input formControlName="from" class="form-control">		
    [...]           
    errors: {{ editForm.controls['from'].errors | json }}
    ```

    </p>
    </details>

3. Also use the control's ``hasError`` method to find out whether the ``minlength`` error has occurred.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    <input formControlName="from" class="form-control">		
    [...]
    <div *ngIf="editForm.controls['from'].hasError('minlength')" class="text-danger">
      ...minlength...
    </div>		
    ```

    </p>
    </details>

4. If you've implemented the flight-validation-errors component make sure to use that here as well.
