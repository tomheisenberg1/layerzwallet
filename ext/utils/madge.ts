/**
 * @fileOverview this script uses madge to check for circular dependencies in the codebase
 * and will exit with non-zero status if number of circular dependencies exceeds the limit.
 * this script is designed to be run on CI
 */
import { exec } from 'child_process';

const NUM_ALLOWED_CIRCULAR_DEPS = 2;

exec('./node_modules/.bin/madge --circular --json --extensions js,jsx,ts,tsx src', (error, stdout, stderr) => {
  if (stdout === null) {
    process.exit(1);
  }

  const circularDeps = JSON.parse(stdout.toString());

  if (circularDeps.length > NUM_ALLOWED_CIRCULAR_DEPS) {
    console.error('Found circular dependencies:', circularDeps.length, 'maximum allowed:', NUM_ALLOWED_CIRCULAR_DEPS);
    process.exit(2);
  }

  process.exit(0);
});
