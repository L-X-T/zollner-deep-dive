// src/app/shared/shared.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DateComponent } from './date/date.component';
import { CityPipe } from './pipes/city.pipe';
import { StatusColorPipe } from './pipes/status-color.pipe';
import { StatusFilterPipe } from './pipes/status-filter.pipe';

import { TabbedPaneComponent } from './controls/tabbed-pane/tabbed-pane.component';
import { TabComponent } from './controls/tab/tab.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DateComponent, CityPipe, StatusColorPipe, StatusFilterPipe, TabbedPaneComponent, TabComponent],
  exports: [CommonModule, FormsModule, DateComponent, CityPipe, StatusColorPipe, StatusFilterPipe, TabbedPaneComponent, TabComponent]
})
export class SharedModule {}
