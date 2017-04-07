import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Subject } from 'rxjs/Subject';
import * as Flatpickr from 'flatpickr';
import { FlatpickrModule } from '../src';

describe('mwl-flatpickr directive', () => {

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
        (flatpickrChange)="events.next({name: 'change', event: $event})"
        (flatpickrOpen)="events.next({name: 'open', event: $event})"
        (flatpickrClose)="events.next({name: 'close', event: $event})"
        (flatpickrMonthChange)="events.next({name: 'monthChange', event: $event})"
        (flatpickrYearChange)="events.next({name: 'yearChange', event: $event})"
        (flatpickrDayCreate)="events.next({name: 'dayCreate', event: $event})">
    `
  })
  class TestComponent {
    modelValue: any;
    altFormat: string = 'd.m.Y';
    altInput: boolean = true;
    events: Subject<any> = new Subject();
    convertModelValue: boolean;
    mode: string;
  }

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
        FlatpickrModule.forRoot({
          altInputClass: 'foo'
        })
      ],
      declarations: [TestComponent]
    });
    Array.from(document.body.querySelectorAll('.flatpickr-calendar')).forEach(instance => {
      instance.parentNode.removeChild(instance);
    });
  });

  it('should allow a date to be selected', () => {
    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.click();
    const instance: Element = document.body.querySelector('.flatpickr-calendar');
    instance.querySelector('.flatpickr-day:not(.prevMonthDay)')['click']();
    expect(input.value).to.equal('2017-04-01');
  });

  it('should create a flatpickr instance with options', () => {
    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    fixture.componentInstance.modelValue = '2017-01-01';
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelectorAll('input')[1];
    expect(input.value).to.equal('01.01.2017');
  });

  it('should allow the flatpicker to be customised globally', () => {
    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelectorAll('input')[1];
    expect(input.classList.contains('foo')).to.be.true;
  });

  describe('convertModelValue', () => {

    it('should convert the value to a date when in single mode', () => {
      const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'single';
      fixture.componentInstance.modelValue = '2017-04-01';
      fixture.detectChanges();
      clock.tick(1);
      expect(fixture.componentInstance.modelValue).to.deep.equal(new Date('2017-04-01'));
    });

    it('should convert the value to an array of date when in multiple mode', () => {
      const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'multiple';
      fixture.componentInstance.modelValue = '2017-04-01; 2017-04-02';
      fixture.detectChanges();
      clock.tick(1);
      expect(fixture.componentInstance.modelValue).to.deep.equal([new Date('2017-04-01'), new Date('2017-04-02')]);
    });

    it('should convert the value to a from / to object when in range mode', () => {
      const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'range';
      fixture.componentInstance.modelValue = '2017-04-01 to 2017-04-02';
      fixture.detectChanges();
      clock.tick(1);
      expect(fixture.componentInstance.modelValue).to.deep.equal({from: new Date('2017-04-01'), to: new Date('2017-04-02')});
    });

    it('should not convert the model value when convertModelValue is false', () => {
      const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
      fixture.componentInstance.convertModelValue = false;
      fixture.componentInstance.mode = 'single';
      fixture.componentInstance.modelValue = '2017-04-01';
      fixture.detectChanges();
      clock.tick(1);
      expect(fixture.componentInstance.modelValue).to.deep.equal('2017-04-01');
    });

    it('should hydrate the initial value when passing a date object', () => {
      const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'single';
      fixture.componentInstance.modelValue = new Date('2017-04-01');
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      expect(input.value).to.equal('2017-04-01');
    });

    it('should hydrate the initial value when passing an array of dates', () => {
      const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'multiple';
      fixture.componentInstance.modelValue = [new Date('2017-04-01'), new Date('2017-04-02')];
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      expect(input.value).to.equal('2017-04-01; 2017-04-02');
    });

    it('should hydrate the initial value when passing a date range', () => {
      const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
      fixture.componentInstance.convertModelValue = true;
      fixture.componentInstance.mode = 'range';
      fixture.componentInstance.modelValue = {from: new Date('2017-04-01'), to: new Date('2017-04-02')};
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      expect(input.value).to.equal('2017-04-01 to 2017-04-02');
    });

  });

  it('should call the flatpickrReady output', done => {
    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    fixture.componentInstance.events.filter(({name}) => name === 'ready').take(1).subscribe(({event}) => {
      expect(event.selectedDates).to.deep.equal([]);
      expect(event.dateString).to.deep.equal('');
      expect(event.instance instanceof Flatpickr).to.be.true;
      done();
    });
    fixture.detectChanges();
  });

  it('should call the flatpickrChange output', done => {
    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    fixture.componentInstance.events.filter(({name}) => name === 'change').take(1).subscribe(({event}) => {
      expect(event.selectedDates[0].getTime()).to.deep.equal(new Date('2017-04-01').getTime() + timezoneOffset);
      expect(event.dateString).to.deep.equal('2017-04-01');
      expect(event.instance instanceof Flatpickr).to.be.true;
      done();
    });
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.click();
    const instance: Element = document.body.querySelector('.flatpickr-calendar');
    instance.querySelector('.flatpickr-day:not(.prevMonthDay)')['click']();
  });

  it('should call the flatpickrClose output', done => {
    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    fixture.componentInstance.events.filter(({name}) => name === 'close').take(1).subscribe(({event}) => {
      expect(event.selectedDates[0].getTime()).to.deep.equal(new Date('2017-04-01').getTime() + timezoneOffset);
      expect(event.dateString).to.deep.equal('2017-04-01');
      expect(event.instance instanceof Flatpickr).to.be.true;
      done();
    });
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.click();
    const instance: Element = document.body.querySelector('.flatpickr-calendar');
    instance.querySelector('.flatpickr-day:not(.prevMonthDay)')['click']();
  });

  it('should call the flatpickrMonthChange output', done => {
    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    fixture.componentInstance.events.filter(({name}) => name === 'monthChange').take(1).subscribe(({event}) => {
      expect(event.selectedDates).to.deep.equal([]);
      expect(event.dateString).to.deep.equal('');
      expect(event.instance instanceof Flatpickr).to.be.true;
      done();
    });
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.click();
    const instance: Element = document.body.querySelector('.flatpickr-calendar');
    instance.querySelector('.flatpickr-prev-month')['click']();
  });

  it('should call the flatpickrYearChange output', done => {
    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    fixture.componentInstance.events.filter(({name}) => name === 'yearChange').take(1).subscribe(({event}) => {
      expect(event.selectedDates).to.deep.equal([]);
      expect(event.dateString).to.deep.equal('');
      expect(event.instance instanceof Flatpickr).to.be.true;
      done();
    });
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.click();
    const instance: Element = document.body.querySelector('.flatpickr-calendar');
    instance.querySelector('.flatpickr-current-month .arrowUp')['click']();
  });

  it('should call the flatpickrDayCreate output', done => {
    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    fixture.componentInstance.events.filter(({name}) => name === 'dayCreate').take(1).subscribe(({event}) => {
      expect(event.selectedDates).to.deep.equal([]);
      expect(event.dateString).to.deep.equal('');
      expect(event.instance instanceof Flatpickr).to.be.true;
      expect(event.dayElement.outerHTML).to.equal('<span class="flatpickr-day prevMonthDay" ' +
        'aria-label="March 26, 2017" tabindex="-1">26</span>');
      done();
    });
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.click();
  });

  it('should destroy the flatpickr instance when the component is destroyed', () => {
    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    let instance: Flatpickr;
    fixture.componentInstance.events.filter(({name}) => name === 'ready').take(1).subscribe(({event}) => {
      instance = event.instance;
    });
    fixture.detectChanges();
    sinon.spy(instance, 'destroy');
    fixture.destroy();
    expect(instance.destroy).to.have.been.calledOnce;
  });

});
