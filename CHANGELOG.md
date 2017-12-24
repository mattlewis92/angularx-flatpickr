# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="5.0.0"></a>
# [5.0.0](https://github.com/mattlewis92/angularx-flatpickr/compare/v4.0.1...v5.0.0) (2017-12-24)


### Features

* auto import flatpickr ([dd78238](https://github.com/mattlewis92/angularx-flatpickr/commit/dd78238))
* upgrade to angular 5 ([d764610](https://github.com/mattlewis92/angularx-flatpickr/commit/d764610))


### BREAKING CHANGES

* Angular 5 or higher is now required to use this package
* the first argument passed to `FlatpickrModule.forRoot` is now the default options
object, instead of the flatpickr provider which was removed



<a name="4.0.1"></a>
## [4.0.1](https://github.com/mattlewis92/angularx-flatpickr/compare/v4.0.0...v4.0.1) (2017-11-08)


### Bug Fixes

* allow angular 5 peer dependency ([684395e](https://github.com/mattlewis92/angularx-flatpickr/commit/684395e))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/mattlewis92/angularx-flatpickr/compare/v3.0.0...v4.0.0) (2017-10-22)


### Bug Fixes

* **aot:** allow the lib to compile with aot ([12c76e8](https://github.com/mattlewis92/angularx-flatpickr/commit/12c76e8)), closes [#7](https://github.com/mattlewis92/angularx-flatpickr/issues/7)


### BREAKING CHANGES

* **aot:** the value you pass to the forRoot method for flatpickr has changed. The new signature is:

```
import { NgModule } from '@angular/core';
import * as flatpickr from 'flatpickr';
import { FlatpickrModule, FLATPICKR } from 'angularx-flatpickr';

export function flatpickrFactory() {
  return flatpickr;
}

@NgModule({
  imports: [
    FlatpickrModule.forRoot({
      provide: FLATPICKR,
      useFactory: flatpickrFactory
    })
  ]
})
class MyModule {}
```



<a name="3.0.0"></a>
# [3.0.0](https://github.com/mattlewis92/angularx-flatpickr/compare/v2.0.1...v3.0.0) (2017-10-18)


### Bug Fixes

* support latest flatpickr ([b66000d](https://github.com/mattlewis92/angularx-flatpickr/commit/b66000d))


### Features

* upgrade flatpickr to v4 ([0fa4335](https://github.com/mattlewis92/angularx-flatpickr/commit/0fa4335)), closes [#4](https://github.com/mattlewis92/angularx-flatpickr/issues/4) [#5](https://github.com/mattlewis92/angularx-flatpickr/issues/5)


### BREAKING CHANGES

* flatpickr is now a peer dependency of this module. You must now add it as an
explicit dependency, import it and pass it to the first argument of `FlatpickrModule.forRoot`



<a name="2.0.1"></a>
## [2.0.1](https://github.com/mattlewis92/angularx-flatpickr/compare/v2.0.0...v2.0.1) (2017-08-17)


### Bug Fixes

* update model value even if convertModelValue is false ([cd5374a](https://github.com/mattlewis92/angularx-flatpickr/commit/cd5374a))
* use input event instead of change event to detect flatpicker changes ([fc6f751](https://github.com/mattlewis92/angularx-flatpickr/commit/fc6f751))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/mattlewis92/angularx-flatpickr/compare/v1.0.0...v2.0.0) (2017-08-11)


### Bug Fixes

* make the directive to work with reactive forms ([e619706](https://github.com/mattlewis92/angularx-flatpickr/commit/e619706)), closes [#1](https://github.com/mattlewis92/angularx-flatpickr/issues/1)


### Features

* upgrade flatpickr to v3 ([ea73c66](https://github.com/mattlewis92/angularx-flatpickr/commit/ea73c66))


### BREAKING CHANGES

* flatpickr has been upgraded to v3. The `utc` was removed from this lib as it was
removed from flatpickr
* the forms module is now required to use this component



<a name="1.0.0"></a>
# 1.0.0 (2017-04-07)


### Features

* initial implementation ([acbd9ac](https://github.com/mattlewis92/angularx-flatpickr/commit/acbd9ac))
