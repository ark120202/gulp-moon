const { spawn } = require('child_process');
const gutil = require('gulp-util');
const through = require('through2');
const path = require('path');
const runnerCode = require('fs')
  .readFileSync(path.join(__dirname, 'moon-runner.lua'), 'utf8');

function escapeLuaString(content) {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\v/g, '\\v')
    .replace(/\t/g, '\\t')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    // .replace(/\\b/g, '\\b')
    // .replace(/\a/g, '\\a')
    .replace(/\f/g, '\\f');
}

module.exports = (options = {}) => through.obj((file, enc, callback) => {
  options.extension = options.extension || '.lua';

  if (file.isNull()) {
    callback(null, file);
    return;
  }

  if (file.isStream()) {
    this.emit('error', new gutil.PluginError('gulp-moonscript', 'Streaming not supported'));
    callback(null, file);
    return;
  }

  const lua = spawn('lua', ['-']);

  let stderr = '';
  let stdout = '';
  lua.stderr.on('data', (data) => {
    stderr += data;
  });
  lua.stdout.on('data', (data) => {
    stdout += data;
  });

  lua.on('close', () => {
    if (stderr) {
      callback(stderr);
    } else {
      file.path = gutil.replaceExtension(file.path, options.extension);
      file.contents = Buffer.from(stdout);
      callback(null, file);
    }
  });

  const fileContents = file.contents.toString('utf8');
  const code = runnerCode.replace('{CODE}', escapeLuaString(fileContents));
  lua.stdin.write(code);
  lua.stdin.end();
});
