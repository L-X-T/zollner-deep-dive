import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { FlightSearchComponent } from '../flight-booking/flight-search/flight-search.component';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss']
})
export class BookingHistoryComponent implements OnInit {
  @ViewChild('pageTitle', { read: ViewContainerRef, static: true }) pageTitle?: ViewContainerRef;

  flightSearchComponent = FlightSearchComponent;

  ngOnInit(): void {
    this.createComponentBelowPageTitle();
  }

  delete(): void {
    console.debug('delete ...');
  }

  private createComponentBelowPageTitle() {
    console.log(this.pageTitle);

    if (this.pageTitle) {
      const componentRef = this.pageTitle.createComponent(FlightSearchComponent);
      const flightSearchComponent = componentRef.instance;
      flightSearchComponent.from = 'Bern';
      flightSearchComponent.to = 'Graz';
      flightSearchComponent.search();
      // flightSearchComponent.delay(); // not working because flights are loaded async
    }
  }
}
