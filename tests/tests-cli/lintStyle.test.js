import test from 'ava';
import shell from 'shelljs';
import path from 'path';

test.before(t => {
  const pkgJsonPath = path.join(__dirname, './../pkg.json');
    if (shell.test('-d', 'cli-test-lint-style')) {
      shell.rm('-rf', 'cli-test-lint-style');
    }
    shell.mkdir('cli-test-lint-style');
    shell.cd('cli-test-lint-style');
    shell.cp(pkgJsonPath, 'package.json');
    const output = shell.exec('npm install');
    if (output.code !== 0) {
      console.log(output.stderr);
      process.exit();
    }
});
test.serial('installation', t => {
    t.true(shell.test('-f', 'package.json'));
    t.true(shell.test('-d', 'node_modules'));
});

test.serial('setup', t => {
  const output = shell.exec('node_modules/.bin/kyt setup -r git@github.com:nytm/wf-kyt-starter-test.git');
  t.is(output.code, 0);
});

test.serial('lint-style', t => {
  let output = shell.exec('node_modules/.bin/kyt lint-style');
  t.is(output.code, 0);
  const outputArr = output.stdout.split('\n');
  t.true(outputArr.includes('Your styles look good! ✨'));
});

test.after(t => {
    shell.cd('..');
    shell.rm('-rf', 'cli-test-lint-style');
});
