import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Subject } from 'rxjs/Subject';
import * as flatpickr from 'flatpickr';
import { FlatpickrModule } from '../src';
import { By } from '@angular/platform-browser';
import { FLATPICKR } from '../src';

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

@Component({
  template: `
    <input
      type="text"
      mwlFlatpickr
      [(ngModel)]="modelValue"
      [altFormat]="altFormat"
      [altInput]="altInput"
      [mode]="mode"
      [locale]="'en'"
      [convertModelValue]="convertModelValue"
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
  events: Subject<any> = new Subject();
  convertModelValue: boolean;
  mode: string;
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
  let clock: sinon.SinonFakeTimers;
  const timezoneOffset: number = new Date().getTimezoneOffset() * 60 * 1000;
  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date('2017-04-06').getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FlatpickrModule.forRoot(
          {
            provide: FLATPICKR,
            useValue: flatpickr
          },
          {
            altInputClass: 'foo'
          }
        )
      ],
      declarations: [NgModelComponent, ReactiveFormsComponent]
    });
    Array.from(
      document.body.querySelectorAll('.flatpickr-calendar')
    ).forEach(instance => {
      instance.parentNode.removeChild(instance);
    });
  });

  describe('non reactive forms', () => {
    it('should allow a date to be selected', () => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.detectChanges();
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
      it('should convert the value to a date when in single mode', () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'single';
        fixture.detectChanges();
        const input: DebugElement = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value = '2017-04-01';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(fixture.componentInstance.modelValue).to.deep.equal(
          new Date('2017-04-01')
        );
      });

      it('should convert the value to an array of date when in multiple mode', () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'multiple';
        fixture.detectChanges();
        const input: DebugElement = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value = '2017-04-01; 2017-04-02';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(fixture.componentInstance.modelValue).to.deep.equal([
          new Date('2017-04-01'),
          new Date('2017-04-02')
        ]);
      });

      it('should convert the value to a from / to object when in range mode', () => {
        const fixture: ComponentFixture<
          NgModelComponent
        > = TestBed.createComponent(NgModelComponent);
        fixture.componentInstance.convertModelValue = true;
        fixture.componentInstance.mode = 'range';
        fixture.detectChanges();
        const input: DebugElement = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value = '2017-04-01 to 2017-04-02';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(fixture.componentInstance.modelValue).to.deep.equal({
          from: new Date('2017-04-01'),
          to: new Date('2017-04-02')
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
        .filter(({ name }) => name === 'ready')
        .take(1)
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
        .filter(({ name }) => name === 'input')
        .take(1)
        .subscribe(({ event }) => {
          expect(event.selectedDates[0].getTime()).to.deep.equal(
            new Date('2017-04-01').getTime() + timezoneOffset
          );
          expect(event.dateString).to.deep.equal('2017-04-01');
          done();
        });
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector(
        'input'
      );
      input.click();
      const instance: any = document.body.querySelector('.flatpickr-calendar');
      clickFlatpickerDate(
        instance.querySelector('.flatpickr-day:not(.prevMonthDay)')
      );
    });

    it('should call the flatpickrClose output', done => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.componentInstance.events
        .filter(({ name }) => name === 'close')
        .take(1)
        .subscribe(({ event }) => {
          expect(event.selectedDates[0].getTime()).to.deep.equal(
            new Date('2017-04-01').getTime() + timezoneOffset
          );
          expect(event.dateString).to.deep.equal('2017-04-01');
          done();
        });
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector(
        'input'
      );
      input.click();
      const instance: any = document.body.querySelector('.flatpickr-calendar');
      clickFlatpickerDate(
        instance.querySelector('.flatpickr-day:not(.prevMonthDay)')
      );
    });

    it('should call the flatpickrMonthChange output', done => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.componentInstance.events
        .filter(({ name }) => name === 'monthChange')
        .take(1)
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
      clickFlatpickerDate(instance.querySelector('.flatpickr-prev-month'));
    });

    it('should call the flatpickrYearChange output', done => {
      const fixture: ComponentFixture<
        NgModelComponent
      > = TestBed.createComponent(NgModelComponent);
      fixture.componentInstance.events
        .filter(({ name }) => name === 'yearChange')
        .take(1)
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
        .filter(({ name }) => name === 'dayCreate')
        .take(1)
        .subscribe(({ event }) => {
          expect(event.selectedDates).to.deep.equal([]);
          expect(event.dateString).to.deep.equal('');
          expect(event.dayElement.outerHTML).to.equal(
            '<span class="flatpickr-day prevMonthDay" ' +
              'aria-label="March 26, 2017" tabindex="-1">26</span>'
          );
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
        .filter(({ name }) => name === 'ready')
        .take(1)
        .subscribe(({ event }) => {
          instance = event.instance;
        });
      fixture.detectChanges();
      sinon.spy(instance, 'destroy');
      fixture.destroy();
      expect(instance.destroy).to.have.callCount(1);
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
        date: new Date('2017-04-01')
      });
    });
  });
});
