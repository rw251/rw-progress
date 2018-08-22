# rw-progress

[![Build Status](https://travis-ci.org/rw251/rw-progress.svg?branch=master)](https://travis-ci.org/rw251/rw-progress)
[![Coverage Status](https://coveralls.io/repos/github/rw251/rw-progress/badge.svg?branch=master)](https://coveralls.io/github/rw251/rw-progress?branch=master)

Minimalistic progress bar inspired (nicked) largely from http://ricostacruz.com/nprogress/

## Usage

script.js
```js
import { Progress } from 'rw-progress';
import 'rw-progress/style.scss'; // assuming you're using a bundler like fuse-box

// Load a page with ajax
Progress.start();
renderPageThenCallback(()=>{
  Progress.done();
});
```

Automatically adds an element to your `body`.