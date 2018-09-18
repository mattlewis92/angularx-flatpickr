# angularx flatpickr

[![Build Status](https://travis-ci.org/mattlewis92/angularx-flatpickr.svg?branch=master)](https://travis-ci.org/mattlewis92/angularx-flatpickr)
[![codecov](https://codecov.io/gh/mattlewis92/angularx-flatpickr/branch/master/graph/badge.svg)](https://codecov.io/gh/mattlewis92/angularx-flatpickr)
[![npm version](https://badge.fury.io/js/angularx-flatpickr.svg)](http://badge.fury.io/js/angularx-flatpickr)
[![devDependency Status](https://david-dm.org/mattlewis92/angularx-flatpickr/dev-status.svg)](https://david-dm.org/mattlewis92/angularx-flatpickr?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/mattlewis92/angularx-flatpickr.svg)](https://github.com/mattlewis92/angularx-flatpickr/issues)
[![GitHub stars](https://img.shields.io/github/stars/mattlewis92/angularx-flatpickr.svg)](https://github.com/mattlewis92/angularx-flatpickr/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mattlewis92/angularx-flatpickr/master/LICENSE)

## Demo

https://mattlewis92.github.io/angularx-flatpickr/

## Table of contents

* [About](#about)
* [Installation](#installation)
* [Documentation](#documentation)
* [Development](#development)
* [License](#license)

## About

An angular 5.0+ wrapper for flatpickr

## Installation

Install through npm:

```
npm install --save flatpickr angularx-flatpickr
```

Then include in your apps module:

```typescript
import 'flatpickr/dist/flatpickr.css'; // you may need to adjust the css import depending on your build tool
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';

@NgModule({
  imports: [FormsModule, FlatpickrModule.forRoot()]
})
export class MyModule {}
```

Finally use in one of your apps components:

```typescript
import { Component } from '@angular/core';

@Component({
  template: `
    <input 
      type="text" 
      mwlFlatpickr 
      [(ngModel)]="selectedDate" 
      [altInput]="true" 
      [convertModelValue]="true">
  `
})
export class MyComponent {}
```

You may also find it useful to view the [demo source](https://github.com/mattlewis92/angularx-flatpickr/blob/master/demo/demo.component.ts).

## Documentation

All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://mattlewis92.github.io/angularx-flatpickr/docs/

## Development

### Prepare your environment

* Install [Node.js](http://nodejs.org/) and npm
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server

Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing

Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release

```bash
npm run release
```

## License

MIT
