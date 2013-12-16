// Load in dependencies
var util = require('util');
var Command = require('commander').Command;
var Completion = require('completion');

// Extend Command
function CompletableCommand() {
  Command.call(this, arguments);
}
util.inherits(CompletableCommand, Command);
var CompletableProto = {
  // Extend command method to add new methods
  command: function () {
    var command = Command.prototype.command.apply(this, arguments);
    CompletableCommand.mixin(command);
    return command;
  },

  // Save a completion command for the current command
  completion: function (fn) {
    this.fn = fn;
    return this;
  },
  // Create method to invoke completion for this command
  complete: function (params, cb) {
    // TODO: We should fallback to environment variables (e.g. COMP_CWORD)
    // Fallback cb
    cb = cb || function (err, results) {
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
    function addChildren(root) {
      var commands = root.commands;
      var retObj = {};
      commands.forEach(function (command) {
        var name = command._name;
        // TODO: We need some `completion` logic here
        retObj[name] = addChildren(command);
      });
      return retObj;
    }
    var tree = addChildren(this);
    var completion = new Completion(tree);

    // TODO: If we are invoked sans params. slice off the first 2 parameters of `line` (e.g. `node /usr/bin/abc`)

    // Parse the arguments
    completion.complete(params, cb);
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