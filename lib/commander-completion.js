// Load in dependencies
var util = require('util');
var commander = require('commander');
var Command = commander.Command;
var Completion = require('completion');

// Define a prototype for the would-be class
// DEV: We don't create a sub-class because `Command.command()` doesn't return an instance of `this`
var CompletableProto = {
  // Save a completion command for the current command
  completion: function (_completion) {
    this._completion = _completion;
    return this;
  },
  // Create method to invoke completion for this command
  complete: function (params, cb) {
    // TODO: We should fallback to environment variables (e.g. COMP_CWORD)
    // TODO: If we are invoked sans params. slice off the first 2 parameters of `line` (e.g. `node /usr/bin/abc`)
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
      // By default, look for completion logic
      var retVal = root._completion;

      // If there was no completion logic, recurse the children
      if (retVal === undefined) {
        retVal = {};
        root.commands.forEach(function (command) {
          var name = command._name;
          retVal[name] = addChildren(command);
        });
      }

      // Return our retVal
      return retVal;
    }
    var tree = {};
    // TODO: Figure out how to work around lack of `this.name`
    tree[this.name] = addChildren(this);
    var completion = new Completion(tree);

    // Parse the arguments
    completion.complete(params, cb);
  }
};

// Define and bind a mixin method
commander.mixinCompletable = function (obj) {
  Object.getOwnPropertyNames(CompletableProto).forEach(function (key) {
    obj[key] = CompletableProto[key];
  });
};
commander.mixinCompletable(Command.prototype);

// Export commander
module.exports = commander;