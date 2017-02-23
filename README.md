# commander-completion [![Build status](https://travis-ci.org/twolfson/commander-completion.svg?branch=master)](https://travis-ci.org/twolfson/commander-completion)

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

```js
var program = require('commander-completion');
program.name = 'git';
program
  .command('checkout')
  .completion(function (info, cb) {
    // For `git checkout dev/|`
    // info.words.value = ['git', 'checkout', 'dev/']
    // info.word.partialLeft = 'dev/'
    getGitBranches(function (err, allBranches) {
      if (err) {
        return cb(err);
      }

      var branches = allBranches.filter(function (branch) {
        // 'chec' === 'chec' (from 'checkout')
        return partialLeftWord === branch.substr(0, partialLeftWord.length);
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

Currently, you are required to specify the `name` property of your `program`.

[`commander.js`]: http://visionmedia.github.io/commander.js/

### `program.mixinCompletable(obj)`
Add the new methods added to `commander.js` to another target

- obj `Object` - Target to add new methods to

### `command.completion(completionFn)`
Save completion function to call when completing the current `command`

- completionFn `Function` - Error-first callback that will callback with matches
    -`completion` should have a signature of `function (info, cb)`
    - info `Object` - Collection of distilled information about original input
        - The format will be the returned value from [twolfson/line-info][]
    - cb `Function` - Error-first callback function to run with matches
        - `cb` has a signature of `function (err, results)`

[twolfson/line-info]: https://github.com/twolfson/line-info#lineinfoparams

### `command.complete(params, cb)`
Get completion results for current `command`

- params `Object` - Information similar to that passed in by `bash's` tab completion
    - line `String` - Input to complete against (similar to `COMP_LINE`)
    - cursor `Number` - Index within `line` of the cursor (similar to `COMP_POINT`)
- cb `Function` - Optional error-first callback function that receives matches
    - `cb` should have a signature of `function (err, results)`
    - If `cb` is not provided, `err` will be thrown and `results` will be printed to `stdout` via `console.log`

## Examples
An full example of `git` would be

```js
var program = require('commander-completion');
program.name = 'git';
program
  // `git checkout master`
  .command('checkout')
  .option('-b', 'Checkout new branch') // `git checkout -b dev/hai`
  .completion(function (info, cb) {
    // Get git branches and find matches
  })
  .action(function () {
    // Checkout a `git` branch
  });
var remote = program.command('remote');
remote
  // `git remote add origin git@github.com:...`
  // No possible tab completion here
  .command('add')
  .action(function () {
    // Add a `git` remote
  });
remote
  // `git remote rm origin`
  .command('rm')
  .completion(function (info, cb) {
    // Get git branches and find matches
  })
  .action(function () {
    // Remove a `git` remote
  });

program.complete({
  // `git remo|add`
  line: 'git remoadd',
  cursor: 8
}, function (err, results) {
  results; // ['remote']
});

program.complete({
  // `git remote |`
  line: 'git remote ',
  cursor: 11
}, function (err, results) {
  results; // ['add', 'rm']
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via `npm run lint` and test via `npm test`.

## Donating
Support this project and [others by twolfson][gratipay] via [gratipay][].

[![Support via Gratipay][gratipay-badge]][gratipay]

[gratipay-badge]: https://cdn.rawgit.com/gratipay/gratipay-badge/2.x.x/dist/gratipay.svg
[gratipay]: https://www.gratipay.com/twolfson/

## Unlicense
As of Dec 16 2013, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
