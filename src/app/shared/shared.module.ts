// src/app/shared/shared.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateComponent } from './date/date.component';
import { CityPipe } from './pipes/city.pipe';
import { StatusColorPipe } from './pipes/status-color.pipe';
import { StatusFilterPipe } from './pipes/status-filter.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DateComponent, CityPipe, StatusColorPipe, StatusFilterPipe],
  exports: [DateComponent, CityPipe, StatusColorPipe, StatusFilterPipe, CommonModule, FormsModule]
})
export class SharedModule {}
