# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
