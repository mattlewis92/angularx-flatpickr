import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mwl-demo-app',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Basic demo</h3>
            </div>
            <div class="panel-body">
              <input
                class="form-control"
                type="text"
                mwlFlatpickr
                [(ngModel)]="basicDemoValue">
              NgModel value: {{ basicDemoValue }}
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Model value as date</h3>
            </div>
            <div class="panel-body">
              <input
                class="form-control"
                type="text"
                mwlFlatpickr
                [(ngModel)]="modelValueAsDate"
                [altInput]="true"
                [convertModelValue]="true">
              NgModel value: {{ modelValueAsDate }}
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Date time picker</h3>
            </div>
            <div class="panel-body">
              <input
                class="form-control"
                type="text"
                mwlFlatpickr
                [(ngModel)]="dateTimeValue"
                [altInput]="true"
                [convertModelValue]="true"
                [enableTime]="true"
                dateFormat="Y-m-dTH:i">
              NgModel value: {{ dateTimeValue }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Multi date picker</h3>
            </div>
            <div class="panel-body">
              <input
                class="form-control"
                type="text"
                mwlFlatpickr
                [(ngModel)]="multiDates"
                [altInput]="true"
                [convertModelValue]="true"
                mode="multiple">
              NgModel value: {{ multiDates }}
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Date range picker</h3>
            </div>
            <div class="panel-body">
              <input
                class="form-control"
                type="text"
                mwlFlatpickr
                [(ngModel)]="rangeValue"
                [altInput]="true"
                [convertModelValue]="true"
                mode="range">
              NgModel value: {{ rangeValue | json }}
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Time picker</h3>
            </div>
            <div class="panel-body">
              <input
                class="form-control"
                type="text"
                mwlFlatpickr
                [(ngModel)]="timePicker"
                [noCalendar]="true"
                [enableTime]="true"
                [dateFormat]="'H:i'"
              >
              NgModel value: {{ timePicker }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-md-offset-4">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Inline picker</h3>
            </div>
            <div class="panel-body inline-flatpickr">
              <input
                class="form-control"
                type="text"
                mwlFlatpickr
                [(ngModel)]="inlineDatePicker"
                [altInput]="true"
                [convertModelValue]="true"
                [inline]="true">
              NgModel value: {{ inlineDatePicker }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .inline-flatpickr .form-control,
      .flatpickr-calendar.arrowTop:before,
      .flatpickr-calendar.arrowTop:after {
        display: none;
      }
    `
  ]
})
export class DemoComponent {
  basicDemoValue = '2017-01-01';
  modelValueAsDate: Date = new Date();
  dateTimeValue: Date = new Date();
  multiDates: Date[] = [new Date(), (new Date() as any)['fp_incr'](10)];
  rangeValue: { from: Date; to: Date } = {
    from: new Date(),
    to: (new Date() as any)['fp_incr'](10)
  };
  inlineDatePicker: Date = new Date();
  timePicker: Date | null = null;
}
