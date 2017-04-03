import { NgModule, ModuleWithProviders } from '@angular/core';
import { HelloWorldComponent } from './hello-world.component';

@NgModule({
  declarations: [
    HelloWorldComponent
  ],
  exports: [
    HelloWorldComponent
  ]
})
export class FlatpickrModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlatpickrModule
    };
  }

}