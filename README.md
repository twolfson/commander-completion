# commander-completion [![Build status](https://travis-ci.org/twolfson/commander-completion.png?branch=master)](https://travis-ci.org/twolfson/commander-completion)

Shell completion for [commander.js][]

This was built as part of [foundry][], a CLI utility for making releases painless.

[commander.js]: https://github.com/visionmedia/commander.js
[foundry]: https://github.com/twolfson/foundry

```js
$ npm pub|
$ npm publish |
```

## Getting Started
Install the module with: `npm install commander-completion`

```javascript
var program = require('commander-completion');
program.name = 'git';
program
  .command('checkout')
  .completion(function (params, cb) {
    // For `git checkout dev/|`
    // params.line = 'git checkout dev'
    // params.cursor = 17
    getGitBranches(function (err, allBranches) {
      if (err) {
        return cb(err);
      }

      var branches = allBranches.filter(function (branch) {
        return params.line.match(branch);
      });
      cb(null, branches);
    });
  })
  .action(function () {
    // Checkout a git branch
  });
program
  .command('completion')
  .action(function () {
    program.completion({
      line: process.env.COMP_LINE,
      cursor: process.env.COMP_POINT
    });
  });

// Parse in arguments (e.g. `COMP_LINE="git che" COMP_POINT=7 git completion`)
// Logs: ['checkout']
program.parse(process.argv);
```

## Documentation
`commander-completion` exposes [`commander.js`][] as its `module.exports`. In addition to this, we expose a few more methods.

[`commander.js`]: http://visionmedia.github.io/commander.js/

### `program.mixinCompletable(obj)`
Add the new methods added to `commander.js` to another target

- obj `Object` - Target to add new methods to

### `command.completion(_completion)`
Save completion function to call when completing the current `command`

- _completion `Function` - Error-first callback that will callback with matches
    -`completion` should have a signature of `function (params, cb)`
    - params `Object` - A container for information
        - line `String` - Original string input to `completion.complete`
        - cursor `Number` - Index within `line` of the cursor
    - cb `Function` - Error-first callback function to run with matches
        - `cb` has a signature of `function (err, results)`

### `command.complete(params, cb)`
Get completion results for current `command`

- params `Object` - Information similar to that passed in by `bash's` tab completion
    - line `String` - Input to complete against (similar to `COMP_LINE`)
    - cursor `Number` - Index within `line` of the cursor (similar to `COMP_POINT`)
- cb `Function` - Optional error-first callback function that receives matches
    - `cb` should have a signature of `function (err, results)`
    - If `cb` is not provided, `err` will be thrown and `results` will be printed to `stdout` via `console.log`

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Unlicense
As of Dec 16 2013, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
