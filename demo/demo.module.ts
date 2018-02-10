import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import flatpickr from 'flatpickr';
import { DemoComponent } from './demo.component';
import { FlatpickrModule, FLATPICKR } from '../src';

export function flatpickrFactory() {
  return flatpickr;
}

@NgModule({
  declarations: [DemoComponent],
  imports: [
    BrowserModule,
    FormsModule,
    FlatpickrModule.forRoot({
      provide: FLATPICKR,
      useFactory: flatpickrFactory
    })
  ],
  bootstrap: [DemoComponent]
})
export class DemoModule {}
