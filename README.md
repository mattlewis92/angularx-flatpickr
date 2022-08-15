# angularx flatpickr

[![Sponsorship](https://img.shields.io/badge/funding-github-%23EA4AAA)](https://github.com/users/mattlewis92/sponsorship)
[![Build Status](https://github.com/mattlewis92/angularx-flatpickr/actions/workflows/ci.yml/badge.svg)](https://github.com/mattlewis92/angularx-flatpickr/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/mattlewis92/angularx-flatpickr/branch/main/graph/badge.svg)](https://codecov.io/gh/mattlewis92/angularx-flatpickr)
[![npm version](https://badge.fury.io/js/angularx-flatpickr.svg)](http://badge.fury.io/js/angularx-flatpickr)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mattlewis92/angularx-flatpickr/main/LICENSE)

## Demo

https://mattlewis92.github.io/angularx-flatpickr/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#license)

## About

An angular 14.0+ wrapper for flatpickr

## Installation

Install through npm:

```
npm install flatpickr angularx-flatpickr
```

Next, in your `angular.json` add `"node_modules/flatpickr/dist/flatpickr.css"` to the `styles` array of your application

Then include in your apps module:

```typescript
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';

@NgModule({
  imports: [FormsModule, FlatpickrModule.forRoot()],
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
      [convertModelValue]="true"
    />
  `,
})
export class MyComponent {}
```

You may also find it useful to view the [demo source](https://github.com/mattlewis92/angularx-flatpickr/blob/main/projects/demo/app/demo.component.ts).

## Documentation

All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://mattlewis92.github.io/angularx-flatpickr/docs/

## Development

### Prepare your environment

- Install [Node.js (>=14.19.0 or >=16.9.0)](http://nodejs.org/)
- Install pnpm: `corepack enable`
- Install local dev dependencies: `pnpm install` while current directory is this repo

### Development server

Run `pnpm start` to start a development server on port 8000 with auto reload + tests.

### Testing

Run `pnpm test` to run tests once or `pnpm test:watch` to continually run tests.

### Release

```bash
pnpm run release
```

## License

MIT
