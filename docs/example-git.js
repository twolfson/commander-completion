var program = require('../');
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
  console.log(err);
  console.log(results); // ['remote']
});

program.complete({
  // `git remote |`
  line: 'git remote ',
  cursor: 11
}, function (err, results) {
  console.log(err);
  console.log(results); // ['add', 'rm']
});
