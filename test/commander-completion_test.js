var assert = require('assert');
var CommanderCompletion = require('../');

describe('A commander with completable commands', function () {
  before(function () {
    this.program = new CommanderCompletion();
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
        // `hel|`
        line: 'hel',
        cursor: 'hel'.length
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
        // `hello w|`
        line: 'hello w',
        cursor: 'hello w'.length
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
