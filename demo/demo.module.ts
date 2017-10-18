import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import * as flatpickr from 'flatpickr';
import { DemoComponent } from './demo.component';
import { FlatpickrModule } from '../src';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, FormsModule, FlatpickrModule.forRoot(flatpickr)],
  bootstrap: [DemoComponent]
})
export class DemoModule {}
