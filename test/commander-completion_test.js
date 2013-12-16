var assert = require('assert');
var CommanderCompletion = require('../').Command;

describe('A commander with completable commands', function () {
  before(function () {
    this.program = new CommanderCompletion();
    this.program.name = 'wat';
    this.program
      .command('hello')
      .completion(function (params, cb) {
        cb(null, ['world']);
      })
      .action(function () {});
  });

  describe('when completing an incomplete command', function () {
    before(function (done) {
      // Complete our input and save results
      var that = this;
      this.program.complete({
        // TODO: Use same lib as from completion
        // `wat hel|`
        line: 'wat hel',
        cursor: 'wat hel'.length
      }, function saveResult (err, results) {
        that.results = results;
        done(err);
      });
    });

    it('completes the command', function () {
      assert.deepEqual(this.results, ['hello']);
    });
  });

  describe('when completing a command\'s results', function () {
    before(function (done) {
      // Complete our input and save results
      var that = this;
      this.program.complete({
        // TODO: Use same lib as from completion
        // `wat hello w|`
        line: 'wat hello w',
        cursor: 'wat hello w'.length
      }, function saveResult (err, results) {
        that.results = results;
        done(err);
      });
    });

    it('completes the command\'s results', function () {
      assert.deepEqual(this.results, ['world']);
    });
  });
});
