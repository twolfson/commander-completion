var CommanderCompletion = require('../');

describe('A commander with completable commands', function () {
  before(function () {
    this.program = new CommanderCompletion()
                     .command('hello')
                     .completion(function (params, cb) {
                       cb(null, ['world']);
                     })
                     .action(function () {});
  });

  describe('when completing an incomplete command', function () {
    before(function (done) {
      this.program.complete({
        // TODO: Use same lib as from completion
        // `node test hel|`
        line: 'node test hel',
        cursor: 'node test hel'.length
      }, function saveResult (err, results) {

      });
    });

    it('completes the command', function () {

    });
  });

  describe('when completing a command\'s results', function () {
    it('completes the command\'s results', function () {

    });
  });
});
