var assert = require('assert');
var CommanderCompletion = require('../').Command;

var commanderCompletionUtils = {
  init: function (fn) {
    before(function createCompletion () {
      // Create and bind options to completion
      this.program = new CommanderCompletion();
      fn.call(this, this.program);
    });
    after(function cleanupCompletion () {
      delete this.program;
    });
  },
  complete: function (command) {
    before(function saveResults (done) {
      // Complete our input and save results
      var that = this;
      this.program.complete({
        // (e.g. `hai wo|`)
        // TODO: Use same lib as from completion (e.g. `hai wo|rld`)
        line: command,
        cursor: command.length
      }, function saveResult (err, results) {
        that.results = results;
        done(err);
      });
    });
    after(function cleanupResults () {
      delete this.results;
    });
  }
};

describe('A commander with completable commands', function () {
  commanderCompletionUtils.init(function (program) {
    program.name = 'wat';
    program
      .command('hello')
      .completion(function (params, cb) {
        cb(null, ['world']);
      })
      .action(function () {});
  });

  describe('when completing an incomplete command', function () {
    commanderCompletionUtils.complete('wat hel');

    it('completes the command', function () {
      assert.deepEqual(this.results, ['hello']);
    });
  });

  describe('when completing a command\'s results', function () {
    commanderCompletionUtils.complete('wat hello w');

    it('completes the command\'s results', function () {
      assert.deepEqual(this.results, ['world']);
    });
  });
});

describe('A commander with options', function () {
  commanderCompletionUtils.init(function (program) {
    this.program.name = 'wat';
    this.program.option('-n, --dry-run', 'Output commands but do nothing');
    this.program
      .command('hello')
      .completion(function (params, cb) {
        cb(null, ['world']);
      })
      .action(function () {});
  });

  describe('completing a command with a short option', function () {
    commanderCompletionUtils.complete('wat -n hel');

    it('completes the command', function () {
      assert.deepEqual(this.results, ['hello']);
    });
  });

  describe('completing a command with a long option', function () {
    commanderCompletionUtils.complete('wat --dry-run hel');

    it('completes the command', function () {
      assert.deepEqual(this.results, ['hello']);
    });
  });

  describe('completing a command without options', function () {
    commanderCompletionUtils.complete('wat hel');

    it('completes the command', function () {
      assert.deepEqual(this.results, ['hello']);
    });
  });
});

describe('A commander with an option that has a required value', function () {
  commanderCompletionUtils.init(function (program) {
    this.program.name = 'hello';
    this.program.option('-d, --dir <cwd>', 'Specify directory');
    this.program
      .command('places')
      .completion(function (params, cb) {
        cb(null, ['world']);
      })
      .action(function () {});
  });

  describe('completing a command with the option and no further values', function () {
    commanderCompletionUtils.complete('hello --dir hai');

    it('returns no matching results', function () {
      assert.deepEqual(this.results, []);
    });
  });

  describe('completing a command with the option and a partial value', function () {
    commanderCompletionUtils.complete('hello --dir huh pla');

    it('returns no matching results', function () {
      assert.deepEqual(this.results, ['places']);
    });
  });
});

describe('A commander with an option that has a optional value', function () {
  commanderCompletionUtils.init(function (program) {
    this.program.name = 'hello';
    this.program.option('-d, --dir [cwd]', 'Specify directory');
    this.program
      .command('places')
      .completion(function (params, cb) {
        cb(null, ['world']);
      })
      .action(function () {});
  });

  describe('completing a command with the option and no further values', function () {
    commanderCompletionUtils.complete('hello --dir hai');

    it('returns no matching results', function () {
      assert.deepEqual(this.results, []);
    });
  });

  describe('completing a command with the option and a partial value', function () {
    commanderCompletionUtils.complete('hello --dir huh pla');

    it('returns no matching results', function () {
      assert.deepEqual(this.results, ['places']);
    });
  });

  describe('completing a command with the option followed by another option and a partial value', function () {
    commanderCompletionUtils.complete('hello --dir huh pla');

    it('returns no matching results', function () {
      assert.deepEqual(this.results, ['places']);
    });
  });
});
