// Load in dependencies
var util = require('util');
var Command = require('commander').Command;

// Extend Command
function CompletableCommand() {
  Command.call(this, arguments);
}
util.inherits(Command, CompletableCommand);
var CompletableProto = {
  // Save a completion command for the current command
  completion: function (fn) {
    this.fn = fn;
  },
  // Create method to invoke completion for this command
  complete: function (params, fn) {
    // Fallback fn
    fn = fn || function (err, results) {
      // If there was an error, throw it
      if (err) {
        throw err;
      }

      // Otherwise, log each result
      results.forEach(function (result) {
        console.log(result);
      });
    };

    // Generate a new Completion based off of this command

    // Parse the arguments
  }
};

// Define and bind a mixin method
CompletableCommand.mixin = function (obj) {
  Object.getOwnPropertyNames(CompletableProto).forEach(function (key) {
    obj[key] = CompletableProto[key];
  });
};
CompletableCommand.mixin(CompletableCommand.prototype);

// Export the CompletableCommand
module.exports = CompletableCommand;