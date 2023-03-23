import { Injectable } from '@angular/core';

export type DisableEnableDate =
  | string
  | Date
  | { from: Date | string; to: Date | string }
  | ((date: Date) => boolean);

export interface FlatpickrDefaultsInterface {
  /**
   * Exactly the same as date format, but for the altInput field.
   */
  altFormat?: string;

  /**
   * 	Show the user a readable date (as per altFormat), but return something totally different to the server.
   */
  altInput?: boolean;

  /**
   * This class will be added to the input element created by the altInput option.
   * Note that `altInput` already inherits classes from the original input.
   */
  altInputClass?: string;

  /**
   * Allows the user to enter a date directly input the input field. By default, direct entry is disabled.
   */
  allowInput?: boolean;

  /**
   * Instead of `body`, appends the calendar to the specified node instead.
   */
  appendTo?: HTMLElement;

  /**
   * Defines how the date will be formatted in the aria-label for calendar days, using the same tokens as dateFormat. If you change this, you should choose a value that will make sense if a screen reader reads it out loud.
   */
  ariaDateFormat?: string;

  /**
   * Whether clicking on the input should open the picker.
   * You could disable this if you wish to open the calendar manually `with.open()`.
   */
  clickOpens?: boolean;

  /**
   * A string of characters which are used to define how the date will be displayed in the input box.
   * The supported characters are defined in the table below.
   */
  dateFormat?: string;
  /**
   * Initial value of the hour element.
   */
  defaultHour?: number;
  /**
   * Initial value of the minute element.
   */
  defaultMinute?: number;
  /**
   * Initial value of the seconds element.
   */
  defaultSeconds?: number;

  /**
   * See <a href="https://chmln.github.io/flatpickr/examples/#disabling-specific-dates">disabling dates</a>.
   */
  disable?: DisableEnableDate[];

  /**
   * Set disableMobile to true to always use the non-native picker.
   * By default, Flatpickr utilizes native datetime widgets unless certain options (e.g. disable) are used.
   */
  disableMobile?: boolean;

  /**
   * See <a href="https://chmln.github.io/flatpickr/examples/#disabling-all-dates-except-select-few">enabling dates</a>.
   */
  enable?: DisableEnableDate[];

  /**
   * Enables time picker.
   */
  enableTime?: boolean;

  /**
   * Enables seconds in the time picker.
   */
  enableSeconds?: boolean;
  /**
   * Allows using a custom date formatting function instead of the built-in handling for date formats using dateFormat, altFormat, etc.
   */
  formatDate?: (value: any) => string;
  /**
   * Adjusts the step for the hour input (incl. scrolling).
   */
  hourIncrement?: number;

  /**
   * Displays the calendar inline.
   */
  inline?: boolean;

  /**
   * The maximum date that a user can pick to (inclusive).
   */
  maxDate?: string | Date;

  /**
   * The minimum date that a user can start picking from (inclusive).
   */
  minDate?: string | Date;

  /**
   * Adjusts the step for the minute input (incl. scrolling).
   */
  minuteIncrement?: number;

  /**
   * Select a single date, multiple dates or a date range.
   */
  mode?: 'single' | 'multiple' | 'range';

  /**
   * HTML for the arrow icon, used to switch months.
   */
  nextArrow?: string;

  /**
   * Hides the day selection in calendar. Use it along with `enableTime` to create a time picker.
   */
  noCalendar?: boolean;

  /**
   * Provide a date for 'today', which will be used instead of "new Date()"
   */
  now?: Date | string | number;

  /**
   * Function that expects a date string and must return a Date object.
   */
  parseDate?: (str: string) => Date;

  /**
   * HTML for the left arrow icon.
   */
  prevArrow?: string;

  /**
   * Show the month using the shorthand version (ie, Sep instead of September).
   */
  shorthandCurrentMonth?: boolean;

  /**
   * Position the calendar inside the wrapper and next to the input element. (Leave `false` unless you know what you're doing).
   */
  static?: boolean;

  /**
   * Displays time picker in 24 hour mode without AM/PM selection when enabled.
   */
  time24hr?: boolean;

  /**
   * When true, dates will parsed, formatted, and displayed in UTC.
   * It's recommended that date strings contain the timezone, but not necessary.
   */
  utc?: boolean;

  /**
   * Enables display of week numbers in calendar.
   */
  weekNumbers?: boolean;

  /**
   * You may override the function that extracts the week numbers from a Date by supplying a getWeek function.
   * It takes in a date as a parameter and should return a corresponding string that you want to appear left of every week.
   */
  getWeek?: (date: Date) => string;

  /**
   * Custom elements and input groups.
   */
  wrap?: boolean;

  /**
   * Array of plugin instances to use.
   */
  plugins?: any[];

  /**
   * The locale object or string to use for the locale.
   */
  locale?: object | string;

  /**
   * Auto convert the ngModel value from a string to a date / array of dates / from - to date object depending on the `mode`
   */
  convertModelValue?: boolean;

  /**
   * The number of months shown.
   */
  showMonths?: number;

  /**
   * How the month should be displayed in the header of the calendar.
   */
  monthSelectorType?: 'static' | 'dropdown';

  /**
   * Array of HTML elements that should not close the picker on click.
   */
  ignoredFocusElements?: HTMLElement[];
}

@Injectable()
export class FlatpickrDefaults implements FlatpickrDefaultsInterface {
  /**
   * Exactly the same as date format, but for the altInput field.
   */
  altFormat: string = 'F j, Y';

  /**
   * 	Show the user a readable date (as per altFormat), but return something totally different to the server.
   */
  altInput: boolean = false;

  /**
   * This class will be added to the input element created by the altInput option.
   * Note that `altInput` already inherits classes from the original input.
   */
  altInputClass: string = '';

  /**
   * Allows the user to enter a date directly input the input field. By default, direct entry is disabled.
   */
  allowInput: boolean = false;

  /**
   * Instead of `body`, appends the calendar to the specified node instead.
   */
  appendTo: HTMLElement | undefined = undefined;

  /**
   * Defines how the date will be formatted in the aria-label for calendar days, using the same tokens as dateFormat. If you change this, you should choose a value that will make sense if a screen reader reads it out loud.
   */
  ariaDateFormat?: string = 'F j, Y';

  /**
   * Whether clicking on the input should open the picker.
   * You could disable this if you wish to open the calendar manually `with.open()`.
   */
  clickOpens: boolean = true;

  /**
   * A string of characters which are used to define how the date will be displayed in the input box.
   * The supported characters are defined in the table below.
   */
  dateFormat: string = 'Y-m-d';

  /**
   * Initial value of the hour element.
   */
  defaultHour?: number = 12;

  /**
   * Initial value of the minute element.
   */
  defaultMinute?: number = 0;

  /**
   * Initial value of the seconds element.
   */
  defaultSeconds?: number = 0;

  /**
   * See <a href="https://chmln.github.io/flatpickr/examples/#disabling-specific-dates">disabling dates</a>.
   */
  disable: DisableEnableDate[] = [];

  /**
   * Set disableMobile to true to always use the non-native picker.
   * By default, Flatpickr utilizes native datetime widgets unless certain options (e.g. disable) are used.
   */
  disableMobile: boolean = false;

  /**
   * See <a href="https://chmln.github.io/flatpickr/examples/#disabling-all-dates-except-select-few">enabling dates</a>.
   */
  enable: DisableEnableDate[];

  /**
   * Enables time picker.
   */
  enableTime: boolean = false;

  /**
   * Enables seconds in the time picker.
   */
  enableSeconds: boolean = false;

  /**
   * Allows using a custom date formatting function instead of the built-in handling for date formats using dateFormat, altFormat, etc.
   */
  formatDate?: (value: any) => string = undefined;

  /**
   * Adjusts the step for the hour input (incl. scrolling).
   */
  hourIncrement: number = 1;

  /**
   * Displays the calendar inline.
   */
  inline: boolean = false;

  /**
   * The maximum date that a user can pick to (inclusive).
   */
  maxDate: string | Date | undefined = undefined;

  /**
   * The minimum date that a user can start picking from (inclusive).
   */
  minDate: string | Date | undefined = undefined;

  /**
   * Adjusts the step for the minute input (incl. scrolling).
   */
  minuteIncrement: number = 5;

  /**
   * Select a single date, multiple dates or a date range.
   */
  mode: 'single' | 'multiple' | 'range' = 'single';

  /**
   * HTML for the arrow icon, used to switch months.
   */
  nextArrow: string = '>';

  /**
   * Hides the day selection in calendar. Use it along with `enableTime` to create a time picker.
   */
  noCalendar: boolean = false;

  /**
   * Default now to the current date
   */
  now: Date | string | number = new Date();

  /**
   * Function that expects a date string and must return a Date object.
   */
  parseDate: (str: string) => Date;

  /**
   * HTML for the left arrow icon.
   */
  prevArrow: string = '<';

  /**
   * Show the month using the shorthand version (ie, Sep instead of September).
   */
  shorthandCurrentMonth: boolean = false;

  /**
   * Position the calendar inside the wrapper and next to the input element. (Leave `false` unless you know what you're doing).
   */
  static: boolean = false;

  /**
   * Displays time picker in 24 hour mode without AM/PM selection when enabled.
   */
  time24hr: boolean = false;

  /**
   * When true, dates will parsed, formatted, and displayed in UTC.
   * It's recommended that date strings contain the timezone, but not necessary.
   */
  utc: boolean = false;

  /**
   * Enables display of week numbers in calendar.
   */
  weekNumbers: boolean = false;

  /**
   * You may override the function that extracts the week numbers from a Date by supplying a getWeek function.
   * It takes in a date as a parameter and should return a corresponding string that you want to appear left of every week.
   */
  getWeek: (date: Date) => string;

  /**
   * Custom elements and input groups.
   */
  wrap: boolean = false;

  /**
   * Array of plugin instances to use.
   */
  plugins: any[] = [];

  /**
   * The locale object or string to use for the locale.
   */
  locale: object | string = 'default';

  /**
   * Auto convert the ngModel value from a string to a date / array of dates / from - to date object depending on the `mode`
   */
  convertModelValue: boolean = false;

  /**
   * The number of months shown.
   */
  showMonths: number = 1;

  /**
   * How the month should be displayed in the header of the calendar.
   */
  monthSelectorType: 'static' | 'dropdown' = 'static';

  /**
   * Array of HTML elements that should not close the picker on click.
   */
  ignoredFocusElements: HTMLElement[] = [];
}
