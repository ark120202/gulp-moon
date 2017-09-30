# gulp-moon

A gulp plugin used for compiling MoonScript to Lua.

## Install

```bash
npm i gulp-moon
# or
yarn add gulp-moon
```

Note: This plugin requires `lua` to be in your PATH and `moonscript` be requirable out of it.

## Usage

```javascript
const gulp = require('gulp');
const moon = require('gulp-moon');

gulp.task('default', () =>
  gulp.src('src/moon/**/*.moon')
    .pipe(moon())
    .pipe(gulp.dest('dest/lua')));
```

### Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| extension | `.lua` | Extension of compiled files |
