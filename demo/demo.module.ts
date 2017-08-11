import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FlatpickrModule } from '../src';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, FormsModule, FlatpickrModule.forRoot()],
  bootstrap: [DemoComponent]
})
export class DemoModule {}
