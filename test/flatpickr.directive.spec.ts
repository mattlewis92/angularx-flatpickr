import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed
} from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Subject } from 'rxjs';
import { FlatpickrModule } from '../src';
import { By } from '@angular/platform-browser';
import { filter, take } from 'rxjs/operators';
import { FlatpickrDefaultsInterface } from '../src/flatpickr-defaults.service';

function triggerDomEvent(
  eventType: string,
  target: HTMLElement | Element,
  eventData: object = {}
) {
  const event: Event = document.createEvent('Event');
  Object.assign(event, eventData);
  event.initEvent(eventType, true, true);
  target.dispatchEvent(event);
}

function clickFlatpickerDate(target: HTMLElement | Element) {
  triggerDomEvent('mousedown', target, {
    which: 1
  });
}

/* tslint:disable: max-inline-declarations enforce-component-selector */

@Component({
  template: `
    <input
      type="text"
      mwlFlatpickr
      [options]="options"
      [(ngModel)]="modelValue"
      [altFormat]="altFormat"
      [altInput]="altInput"
      [mode]="mode"
      [convertModelValue]="convertModelValue"
      [enableTime]="enableTime"
      [dateFormat]="dateFormat"
      [now]="now"
      (flatpickrReady)="events.next({name: 'ready', event: $event})"
      (flatpickrValueUpdate)="events.next({name: 'valueUpdate', event: $event})"
      (flatpickrChange)="events.next({name: 'input', event: $event})"
      (flatpickrOpen)="events.next({name: 'open', event: $event})"
      (flatpickrClose)="events.next({name: 'close', event: $event})"
      (flatpickrMonthChange)="events.next({name: 'monthChange', event: $event})"
      (flatpickrYearChange)="events.next({name: 'yearChange', event: $event})"
      (flatpickrDayCreate)="events.next({name: 'dayCreate', event: $event})">
    `
})
class NgModelComponent {
  modelValue: any;
  altFormat = 'd.m.Y';
  altInput = true;
  events = new Subject<any>();
  convertModelValue: boolean;
  mode: string;
  enableTime = false;
  dateFormat = 'Y-m-d';
  now = null;
  options: FlatpickrDefaultsInterface = {
    altFormat: 'Y-m-d',
    enableTime: true,
    locale: 'en'
  };
}

// tslint:disable-next-line
@Component({
  template: `
    <form [formGroup]="form">
      <input
        type="text"
        formControlName="date"
        mwlFlatpickr
        [altFormat]="altFormat"
        [altInput]="altInput"
        [mode]="mode"
        [locale]="'en'"
        [convertModelValue]="convertModelValue">
    </form>
    `
})
class ReactiveFormsComponent {
  modelValue: any;
  altFormat = 'd.m.Y';
  altInput = true;
  events: Subject<any> = new Subject();
  convertModelValue: boolean;
  mode: string;
  form: FormGroup = new FormGroup({
    date: new FormControl(new Date('2017-07-11'))
  });
}

describe('mwl-flatpickr directive', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FlatpickrModule.forRoot({
          altInputClass: 'foo',
          defaultHour: 0
        })
      ],
      declarations: [NgModelComponent, ReactiveFormsComponent]
    }).compileComponents();
    Array.from(document.body.querySelectorAll('.flatpickr-calendar')).forEach(
      instance => {
        instance.parentNode.removeChild(instance);
      }
    );
  });

  describe('non reactive forms', () => {
    it('should allow a date to be selected', async () => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.detectChanges();

      fixture.componentInstance.modelValue = '2017-04-01';
      fixture.detectChanges();
      await fixture.whenStable();
      const input: HTMLInputElement = fixture.nativeElement.querySelector(
        'input'
      );

      input.click();
      const instance: any = document.body.querySelector('.flatpickr-calendar');
      clickFlatpickerDate(
        instance.querySelector('.flatpickr-day:not(.prevMonthDay)')
      );
      expect(input.value).to.equal('2017-04-01');
    });

    it('should create a flatpickr instance with options', async () => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.componentInstance.modelValue = '2017-01-01';
      fixture.detectChanges();
      await fixture.whenStable();
      const input: HTMLInputElement = fixture.nativeElement.querySelectorAll(
        'input'
      )[1];
      expect(input.value).to.equal('01.01.2017');
    });

    it('should allow the flatpicker to be customised globally', () => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelectorAll(
        'input'
      )[1];
      expect(input.classList.contains('foo')).to.equal(true);
    });

    describe('convertModelValue', () => {
      it('should convert the value to a date without time when in single mode', () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'single';
        fixture.detectChanges();
        const input: DebugElement = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value = '2017-04-01T15:15:15';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(fixture.componentInstance.modelValue).to.deep.equal(
          new Date('2017-04-01T00:00:00')
        );
      });

      it('should convert the value to a date with time when in single mode with `enableTime` flag', () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'single';
        fixture.componentInstance.dateFormat = 'Y-m-dTH:i:s';
        fixture.componentInstance.enableTime = true;
        fixture.detectChanges();
        const input: DebugElement = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value = '2017-04-01T15:15:15';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(fixture.componentInstance.modelValue).to.deep.equal(
          new Date('2017-04-01T15:15:15')
        );
      });

      it('should convert the value to an array of dates without time when in multiple mode', () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'multiple';
        fixture.detectChanges();

        const input: DebugElement = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value = '2017-04-01T15:15:15; 2017-04-02T15:15:15';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(fixture.componentInstance.modelValue).to.deep.equal([
          new Date('2017-04-01T00:00:00'),
          new Date('2017-04-02T00:00:00')
        ]);
      });

      it('should convert the value to an array of dates with time when in multiple mode with `enableTime` flag', () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'multiple';
        fixture.componentInstance.dateFormat = 'Y-m-dTH:i:s';
        fixture.componentInstance.enableTime = true;
        fixture.detectChanges();
        const input: DebugElement = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value = '2017-04-01T15:15:15; 2017-04-02T15:15:15';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(fixture.componentInstance.modelValue).to.deep.equal([
          new Date('2017-04-01T15:15:15'),
          new Date('2017-04-02T15:15:15')
        ]);
      });

      it('should convert the value to a from / to object without time when in range mode', () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'range';
        fixture.detectChanges();
        const input: DebugElement = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value =
          '2017-04-01 15:15:15 to 2017-04-02 15:15:15';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(fixture.componentInstance.modelValue).to.deep.equal({
          from: new Date('2017-04-01T00:00:00'),
          to: new Date('2017-04-02T00:00:00')
        });
      });

      it('should convert the value to a from / to object with time when in range mode with `enableTime` flag', () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'range';
        fixture.componentInstance.dateFormat = 'Y-m-dTH:i:s';
        fixture.componentInstance.enableTime = true;
        fixture.detectChanges();
        const input: DebugElement = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value =
          '2017-04-01 15:15:15 to 2017-04-02 15:15:15';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(fixture.componentInstance.modelValue).to.deep.equal({
          from: new Date('2017-04-01T15:15:15'),
          to: new Date('2017-04-02T15:15:15')
        });
      });

      it('should not convert the model value when convertModelValue is false', async () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = false;
        fixture.componentInstance.mode = 'single';
        fixture.componentInstance.modelValue = '2017-04-01';
        fixture.detectChanges();
        await fixture.whenStable();
        expect(fixture.componentInstance.modelValue).to.deep.equal(
          '2017-04-01'
        );
      });

      it('should hydrate the initial value when passing a date object', async () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'single';
        fixture.componentInstance.modelValue = new Date('2017-04-01');
        fixture.detectChanges();
        await fixture.whenStable();
        const input: HTMLInputElement = fixture.nativeElement.querySelector(
          'input'
        );
        expect(input.value).to.equal('2017-04-01');
      });

      it('should hydrate the initial value when passing an array of dates', async () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'multiple';
        fixture.componentInstance.modelValue = [
          new Date('2017-04-01'),
          new Date('2017-04-02')
        ];
        fixture.detectChanges();
        await fixture.whenStable();
        const input: HTMLInputElement = fixture.nativeElement.querySelector(
          'input'
        );
        expect(input.value).to.equal('2017-04-01, 2017-04-02');
      });

      it('should hydrate the initial value when passing a date range', async () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'range';
        fixture.componentInstance.modelValue = {
          from: new Date('2017-04-01'),
          to: new Date('2017-04-02')
        };
        fixture.detectChanges();
        await fixture.whenStable();
        const input: HTMLInputElement = fixture.nativeElement.querySelector(
          'input'
        );
        expect(input.value).to.equal('2017-04-01 to 2017-04-02');
      });

      it('should update the model value when convertModelValue is false', () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = false;
        fixture.componentInstance.mode = 'single';
        fixture.detectChanges();
        const input: DebugElement = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value = '2017-04-01';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(fixture.componentInstance.modelValue).to.deep.equal(
          '2017-04-01'
        );
      });
    });

    it('should call the flatpickrReady output', done => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.componentInstance.events
        .pipe(
          filter(({ name }) => name === 'ready'),
          take(1)
        )
        .subscribe(({ event }) => {
          expect(event.selectedDates).to.deep.equal([]);
          expect(event.dateString).to.deep.equal('');
          done();
        });
      fixture.detectChanges();
    });

    it('should call the flatpickrChange output', done => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.componentInstance.events
        .pipe(
          filter(({ name }) => name === 'input'),
          take(1)
        )
        .subscribe(({ event }) => {
          expect(event.selectedDates[0].getTime()).to.deep.equal(
            new Date('2017-04-01T00:00:00').getTime()
          );
          expect(event.dateString).to.deep.equal('2017-04-01');
          done();
        });
      fixture.componentInstance.modelValue = '2017-04-01';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const input: HTMLInputElement = fixture.nativeElement.querySelector(
          'input'
        );

        input.click();
        const instance: any = document.body.querySelector(
          '.flatpickr-calendar'
        );
        clickFlatpickerDate(
          instance.querySelector('.flatpickr-day:not(.prevMonthDay)')
        );
      });
    });

    it('should call the flatpickrClose output', done => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.componentInstance.events
        .pipe(
          filter(({ name }) => name === 'close'),
          take(1)
        )
        .subscribe(({ event }) => {
          expect(event.selectedDates[0].getTime()).to.deep.equal(
            new Date('2017-04-01T00:00:00').getTime()
          );
          expect(event.dateString).to.deep.equal('2017-04-01');
          done();
        });
      fixture.componentInstance.modelValue = '2017-04-01';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const input: HTMLInputElement = fixture.nativeElement.querySelector(
          'input'
        );
        input.click();
        const instance: any = document.body.querySelector(
          '.flatpickr-calendar'
        );
        clickFlatpickerDate(
          instance.querySelector('.flatpickr-day:not(.prevMonthDay)')
        );
      });
    });

    it.skip(
      'should call the flatpickrMonthChange output',
      fakeAsync(done => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.events
          .pipe(
            filter(({ name }) => name === 'monthChange'),
            take(1)
          )
          .subscribe(({ event }) => {
            expect(event.selectedDates).to.deep.equal([]);
            expect(event.dateString).to.deep.equal('');
            done();
          });
        fixture.detectChanges();
        const input: HTMLInputElement = fixture.nativeElement.querySelector(
          'input'
        );
        input.click();
        const instance: any = document.body.querySelector(
          '.flatpickr-calendar'
        );
        clickFlatpickerDate(instance.querySelector('.flatpickr-prev-month'));
        flush();
      })
    );

    it('should call the flatpickrYearChange output', done => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.componentInstance.events
        .pipe(
          filter(({ name }) => name === 'yearChange'),
          take(1)
        )
        .subscribe(({ event }) => {
          expect(event.selectedDates).to.deep.equal([]);
          expect(event.dateString).to.deep.equal('');
          done();
        });
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector(
        'input'
      );
      input.click();
      const instance: any = document.body.querySelector('.flatpickr-calendar');
      clickFlatpickerDate(
        instance.querySelector('.flatpickr-current-month .arrowUp')
      );
    });

    it('should call the flatpickrDayCreate output', done => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.componentInstance.events
        .pipe(
          filter(({ name }) => name === 'dayCreate'),
          take(1)
        )
        .subscribe(({ event }) => {
          expect(event.selectedDates).to.deep.equal([]);
          expect(event.dateString).to.deep.equal('');
          done();
        });
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector(
        'input'
      );
      input.click();
    });

    it('should destroy the flatpickr instance when the component is destroyed', () => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      let instance: any;
      fixture.componentInstance.events
        .pipe(
          filter(({ name }) => name === 'ready'),
          take(1)
        )
        .subscribe(({ event }) => {
          instance = event.instance;
        });
      fixture.detectChanges();
      sinon.spy(instance, 'destroy');
      fixture.destroy();
      expect(instance.destroy).to.have.callCount(1);
    });

    it('should use a different now date', async () => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);

      // set the now date for the component
      fixture.componentInstance.now = new Date('2017-05-01T00:00:00');
      fixture.detectChanges();
      await fixture.whenStable();

      // click the input
      const input = fixture.debugElement.query(By.css('input'));
      input.triggerEventHandler('click', null);
      fixture.detectChanges();
      await fixture.whenStable();

      // wait until the flatpickr HTML has been rendered to the DOM
      await waitUntilElementWithClassExists('flatpickr-days');

      // verify that the currently selected day matches what we passed into now
      const instance: any = document.body.querySelector(
        '.flatpickr-days .today'
      );

      expect(instance.getAttribute('aria-label')).to.equal('May 1, 2017');
    });
  });

  describe('reactive forms', () => {
    it('update the input value with the form initial value', async () => {
      const fixture: ComponentFixture<
        ReactiveFormsComponent
      > = TestBed.createComponent(ReactiveFormsComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'single';
      fixture.detectChanges();
      await fixture.whenStable();
      const input: DebugElement = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.value).to.deep.equal('2017-07-11');
    });

    it('update the form value when the input changes', () => {
      const fixture: ComponentFixture<
        ReactiveFormsComponent
      > = TestBed.createComponent(ReactiveFormsComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'single';
      fixture.detectChanges();
      const input: DebugElement = fixture.debugElement.query(By.css('input'));
      input.nativeElement.value = '2017-04-01';
      input.triggerEventHandler('input', { target: input.nativeElement });
      expect(fixture.componentInstance.form.value).to.deep.equal({
        date: new Date('2017-04-01T00:00:00')
      });
    });

    it('should mark the input as touched', async () => {
      const fixture: ComponentFixture<
        ReactiveFormsComponent
      > = TestBed.createComponent(ReactiveFormsComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'single';
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.componentInstance.form.controls.date.touched).to.equal(
        false
      );
      const input: DebugElement = fixture.debugElement.query(By.css('input'));
      input.triggerEventHandler('blur', {});
      fixture.detectChanges();
      expect(fixture.componentInstance.form.controls.date.touched).to.equal(
        true
      );
    });

    it('should disable the input with `altInput` flag', async () => {
      const fixture: ComponentFixture<
        ReactiveFormsComponent
      > = TestBed.createComponent(ReactiveFormsComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'single';
      fixture.componentInstance.altInput = true;
      fixture.detectChanges();
      await fixture.whenStable();
      const input: HTMLInputElement = fixture.nativeElement.querySelectorAll(
        'input'
      )[1];
      expect(input.disabled).to.equal(false);
      fixture.componentInstance.form.controls.date.disable();
      fixture.detectChanges();
      expect(input.disabled).to.equal(true);
      fixture.componentInstance.form.controls.date.enable();
      fixture.detectChanges();
      expect(input.disabled).to.equal(false);
    });

    it('should disable the input without `altInput` flag', async () => {
      const fixture: ComponentFixture<
        ReactiveFormsComponent
      > = TestBed.createComponent(ReactiveFormsComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'single';
      fixture.componentInstance.altInput = false;
      fixture.detectChanges();
      await fixture.whenStable();
      const input: HTMLInputElement = fixture.nativeElement.querySelectorAll(
        'input'
      )[0];
      expect(input.disabled).to.equal(false);
      fixture.componentInstance.form.controls.date.disable();
      fixture.detectChanges();
      expect(input.disabled).to.equal(true);
      fixture.componentInstance.form.controls.date.enable();
      fixture.detectChanges();
      expect(input.disabled).to.equal(false);
    });
  });
});

/**
 * Helper function to wait for the DOM to render an element. The fixture will not wait for external deps such as flatpickr.
 *
 * @param selector the css class on the element to wait for (required)
 * @param max the max number of second to wait and then fail (optional)
 * @param current the current number of second we have already waiting (optional)
 * @param resolve the resolve handler to be called on success (internal use only)
 * @param reject the reject handler to be called on failure (internal use only)
 */
function waitUntilElementWithClassExists(
  selector: string,
  max: number = 1000,
  current: number = 0,
  resolve?: () => any,
  reject?: () => any
): Promise<void> {
  // console.log('waitUntilElementWithClassExists(): checking for element');
  if (!resolve) {
    // console.log('waitUntilElementWithClassExists(): first run');
    return new Promise<void>((resolve2, reject2) => {
      waitUntilElementWithClassExists(
        selector,
        max,
        current,
        resolve2,
        reject2
      );
    });
  } else if (document.getElementsByClassName(selector).length > 0) {
    // console.log('waitUntilElementWithClassExists(): found element');
    return resolve();
  } else if (current + 50 >= max) {
    // console.log('waitUntilElementWithClassExists(): timeout waiting for element');
    return reject();
  } else {
    // console.log('waitUntilElementWithClassExists(): NOT found element, waiting');
    setTimeout(() => {
      waitUntilElementWithClassExists(
        selector,
        max,
        current + 50,
        resolve,
        reject
      );
    }, 50);
  }
}
