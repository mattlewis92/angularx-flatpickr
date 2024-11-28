import {
  NgModule,
  ModuleWithProviders,
  InjectionToken,
  Provider,
} from '@angular/core';
import { FlatpickrDirective } from './flatpickr.directive';
import {
  FlatpickrDefaults,
  FlatpickrDefaultsInterface,
} from './flatpickr-defaults.service';

export const USER_DEFAULTS = new InjectionToken('flatpickr defaults');

export function provideFlatpickrDefaults(
  userDefaults: FlatpickrDefaultsInterface = {},
): Provider[] {
  return [
    {
      provide: USER_DEFAULTS,
      useValue: userDefaults,
    },
    {
      provide: FlatpickrDefaults,
      useFactory() {
        const defaults: FlatpickrDefaults = new FlatpickrDefaults();
        Object.assign(defaults, userDefaults);
        return defaults;
      },
      deps: [USER_DEFAULTS],
    },
  ];
}

/**
 * @deprecated Will be removed in the next major version. Please use the standalone `FlatpickrDirective` and `provideFlatpickrDefaults()` instead.
 */
@NgModule({
  imports: [FlatpickrDirective],
  exports: [FlatpickrDirective],
})
export class FlatpickrModule {
  static forRoot(
    userDefaults: FlatpickrDefaultsInterface = {},
  ): ModuleWithProviders<FlatpickrModule> {
    return {
      ngModule: FlatpickrModule,
      providers: provideFlatpickrDefaults(userDefaults),
    };
  }
}
