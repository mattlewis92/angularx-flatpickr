import { Directive, ElementRef, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FlatpickrDefaults, DisableEnableDate } from './flatpickr-defaults.service';
import * as Flatpickr from 'flatpickr';

export interface FlatPickrOutputOptions {
  selectedDates: Date[];
  dateString: string;
  instance: Flatpickr;
}

export interface FlatPickrDayCreateOutputOptions extends FlatPickrOutputOptions {
  dayElement: HTMLElement;
}

export type NgModelValue = Date | Date[] | {from: Date, to: Date};

@Directive({
  selector: '[mwlFlatpickr]'
})
export class FlatpickrDirective implements OnInit, OnChanges, OnDestroy {

  /**
   * Exactly the same as date format, but for the altInput field.
   */
  @Input() altFormat: string;

  /**
   * 	Show the user a readable date (as per altFormat), but return something totally different to the server.
   */
  @Input() altInput: boolean;

  /**
   * This class will be added to the input element created by the altInput option.
   * Note that `altInput` already inherits classes from the original input.
   */
  @Input() altInputClass: string;

  /**
   * Allows the user to enter a date directly input the input field. By default, direct entry is disabled.
   */
  @Input() allowInput: boolean;

  /**
   * Instead of `body`, appends the calendar to the specified node instead.
   */
  @Input() appendTo: HTMLElement;

  /**
   * Whether clicking on the input should open the picker.
   * You could disable this if you wish to open the calendar manually `with.open()`.
   */
  @Input() clickOpens: boolean;

  /**
   * A string of characters which are used to define how the date will be displayed in the input box.
   * The supported characters are defined in the table below.
   */
  @Input() dateFormat: string;

  /**
   * See <a href="https://chmln.github.io/flatpickr/examples/#disabling-specific-dates">disabling dates</a>.
   */
  @Input() disable: DisableEnableDate[];

  /**
   * Set disableMobile to true to always use the non-native picker.
   * By default, Flatpickr utilizes native datetime widgets unless certain options (e.g. disable) are used.
   */
  @Input() disableMobile: boolean;

  /**
   * See <a href="https://chmln.github.io/flatpickr/examples/#disabling-all-dates-except-select-few">enabling dates</a>.
   */
  @Input() enable: DisableEnableDate[];

  /**
   * Enables time picker.
   */
  @Input() enableTime: boolean;

  /**
   * Enables seconds in the time picker.
   */
  @Input() enableSeconds: boolean;

  /**
   * Adjusts the step for the hour input (incl. scrolling).
   */
  @Input() hourIncrement: number;

  /**
   * Displays the calendar inline.
   */
  @Input() inline: boolean;

  /**
   * The maximum date that a user can pick to (inclusive).
   */
  @Input() maxDate: string | Date;

  /**
   * The minimum date that a user can start picking from (inclusive).
   */
  @Input() minDate: string | Date;

  /**
   * Adjusts the step for the minute input (incl. scrolling).
   */
  @Input() minuteIncrement: number;

  /**
   * Select a single date, multiple dates or a date range.
   */
  @Input() mode: 'single' | 'multiple' | 'range';

  /**
   * HTML for the arrow icon, used to switch months.
   */
  @Input() nextArrow: string;

  /**
   * Hides the day selection in calendar. Use it along with `enableTime` to create a time picker.
   */
  @Input() noCalendar: boolean;

  /**
   * Function that expects a date string and must return a Date object.
   */
  @Input() parseDate: (str: string) => Date;

  /**
   * HTML for the left arrow icon.
   */
  @Input() prevArrow: string;

  /**
   * Show the month using the shorthand version (ie, Sep instead of September).
   */
  @Input() shorthandCurrentMonth: boolean;

  /**
   * Position the calendar inside the wrapper and next to the input element. (Leave `false` unless you know what you're doing).
   */
  @Input() static: boolean;

  /**
   * Displays time picker in 24 hour mode without AM/PM selection when enabled.
   */
  @Input() time24hr: boolean;

  /**
   * When true, dates will parsed, formatted, and displayed in UTC.
   * It's recommended that date strings contain the timezone, but not necessary.
   */
  @Input() utc: boolean;

  /**
   * Enables display of week numbers in calendar.
   */
  @Input() weekNumbers: boolean;

  /**
   * You may override the function that extracts the week numbers from a Date by supplying a getWeek function.
   * It takes in a date as a parameter and should return a corresponding string that you want to appear left of every week.
   */
  @Input() getWeek: (date: Date) => string;

  /**
   * Custom elements and input groups.
   */
  @Input() wrap: boolean;

  /**
   * Array of plugin instances to use.
   */
  @Input() plugins: any[];

  /**
   * The locale object or string to use for the locale.
   */
  @Input() locale: object | string;

  /**
   * Auto convert the ngModel value from a string to a date / array of dates / from - to date object depending on the `mode`
   */
  @Input() convertModelValue: boolean;

  /**
   * @hidden
   */
  @Input() ngModel: NgModelValue | string;

  /**
   * @hidden
   */
  @Output() ngModelChange: EventEmitter<NgModelValue> = new EventEmitter();

  /**
   * Gets triggered once the calendar is in a ready state
   */
  @Output() flatpickrReady: EventEmitter<FlatPickrOutputOptions> = new EventEmitter();

  /**
   * Gets triggered when the user selects a date, or changes the time on a selected date.
   */
  @Output() flatpickrChange: EventEmitter<FlatPickrOutputOptions> = new EventEmitter();

  /**
   * Gets triggered when the input value is updated with a new date string.
   */
  @Output() flatpickrValueUpdate: EventEmitter<FlatPickrOutputOptions> = new EventEmitter();

  /**
   * Gets triggered when the calendar is opened.
   */
  @Output() flatpickrOpen: EventEmitter<FlatPickrOutputOptions> = new EventEmitter();

  /**
   * Gets triggered when the calendar is closed.
   */
  @Output() flatpickrClose: EventEmitter<FlatPickrOutputOptions> = new EventEmitter();

  /**
   * Gets triggered when the month is changed, either by the user or programmatically.
   */
  @Output() flatpickrMonthChange: EventEmitter<FlatPickrOutputOptions> = new EventEmitter();

  /**
   * Gets triggered when the year is changed, either by the user or programmatically.
   */
  @Output() flatpickrYearChange: EventEmitter<FlatPickrOutputOptions> = new EventEmitter();

  /**
   * Take full control of every date cell with this output
   */
  @Output() flatpickrDayCreate: EventEmitter<FlatPickrDayCreateOutputOptions> = new EventEmitter();

  private instance: Flatpickr;

  constructor(private elm: ElementRef, private defaults: FlatpickrDefaults) {}

  ngOnInit(): void {

    let defaultDate: NgModelValue | string = this.ngModel;

    if (this.mode === 'range' && typeof defaultDate === 'object' && !(defaultDate instanceof Date) && !Array.isArray(defaultDate)) {
      defaultDate = `${defaultDate.from.toISOString()} to ${defaultDate.to.toISOString()}`;
    }

    const options: any = {
      altFormat: this.altFormat,
      altInput: this.altInput,
      altInputClass: this.altInputClass,
      allowInput: this.allowInput,
      appendTo: this.appendTo,
      clickOpens: this.clickOpens,
      dateFormat: this.dateFormat,
      defaultDate,
      disable: this.disable,
      disableMobile: this.disableMobile,
      enable: this.enable,
      enableTime: this.enableTime,
      enableSeconds: this.enableSeconds,
      hourIncrement: this.hourIncrement,
      inline: this.inline,
      maxDate: this.maxDate,
      minDate: this.minDate,
      minuteIncrement: this.minuteIncrement,
      mode: this.mode,
      nextArrow: this.nextArrow,
      noCalendar: this.noCalendar,
      parseDate: this.parseDate,
      prevArrow: this.prevArrow,
      shorthandCurrentMonth: this.shorthandCurrentMonth,
      static: this.static,
      time24hr: this.time24hr,
      utc: this.utc,
      weekNumbers: this.weekNumbers,
      getWeek: this.getWeek,
      wrap: this.wrap,
      plugins: this.plugins,
      onChange: (selectedDates: Date[], dateString: string, instance: Flatpickr) => {
        this.flatpickrChange.emit({selectedDates, dateString, instance});
      },
      onOpen: (selectedDates: Date[], dateString: string, instance: Flatpickr) => {
        this.flatpickrOpen.emit({selectedDates, dateString, instance});
      },
      onClose: (selectedDates: Date[], dateString: string, instance: Flatpickr) => {
        this.flatpickrClose.emit({selectedDates, dateString, instance});
      },
      onMonthChange: (selectedDates: Date[], dateString: string, instance: Flatpickr) => {
        this.flatpickrMonthChange.emit({selectedDates, dateString, instance});
      },
      onYearChange: (selectedDates: Date[], dateString: string, instance: Flatpickr) => {
        this.flatpickrYearChange.emit({selectedDates, dateString, instance});
      },
      onReady: (selectedDates: Date[], dateString: string, instance: Flatpickr) => {
        this.flatpickrReady.emit({selectedDates, dateString, instance});
      },
      onValueUpdate: (selectedDates: Date[], dateString: string, instance: Flatpickr) => {
        this.flatpickrValueUpdate.emit({selectedDates, dateString, instance});
      },
      onDayCreate: (selectedDates: Date[], dateString: string, instance: Flatpickr, dayElement: HTMLElement) => {
        this.flatpickrDayCreate.emit({selectedDates, dateString, instance, dayElement});
      }
    };
    if (this.locale) { // workaround warning from flatpickr
      options.locale = this.locale;
    }
    Object.keys(options).forEach(key => {
      if (typeof options[key] === 'undefined') {
        options[key] = this.defaults[key];
      }
    });
    options.time_24hr = options.time24hr;
    this.instance = new Flatpickr(this.elm.nativeElement, options);
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.instance) {
      for (const inputKey in changes) {
        this.instance.set(inputKey, this[inputKey]);
      }
    }

    if (changes.ngModel && this.convertModelValue) {
      setTimeout(() => {
        if (typeof this.ngModel === 'string') {
          switch (this.mode) {

            case 'multiple':
              const dates: Date[] = this.ngModel.split('; ').map(str => new Date(str));
              this.ngModelChange.emit(dates);
              break;

            case 'range':
              const [from, to] = this.ngModel.split(' to ').map(str => new Date(str));
              this.ngModelChange.emit({from, to});
              break;

            case 'single':
            default:
              this.ngModelChange.emit(new Date(this.ngModel));
              break;
          }

        }
      });
    }

  }

  ngOnDestroy(): void {
    this.instance.destroy();
  }

}
