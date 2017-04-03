import { Component } from '@angular/core';

@Component({
  selector: 'mwl-hello-world',
  template: 'Hello world from the {{ projectTitle }} module!'
})
export class HelloWorldComponent {
  projectTitle: string = 'angularx flatpickr';
}
