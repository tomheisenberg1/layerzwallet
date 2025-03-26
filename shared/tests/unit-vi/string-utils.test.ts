import assert from 'assert';
import { test } from 'vitest';
import { getDecimalsByNetwork } from '../../models/network-getters';
import { capitalizeFirstLetter, formatBalance } from '../../modules/string-utils';
import { NETWORK_BITCOIN } from '../../types/networks';

test('capitalizeFirstLetter', () => {
  assert.strictEqual(capitalizeFirstLetter('hello world'), 'Hello world');
  assert.strictEqual(capitalizeFirstLetter('Hello world'), 'Hello world');
  assert.strictEqual(capitalizeFirstLetter('111'), '111');
  assert.strictEqual(capitalizeFirstLetter(''), '');
});

test('formatBalance', () => {
  assert.strictEqual(formatBalance('123000000', getDecimalsByNetwork(NETWORK_BITCOIN), 8), '1.23');
  assert.strictEqual(formatBalance('123456789', getDecimalsByNetwork(NETWORK_BITCOIN), 8), '1.23456789');
  assert.strictEqual(formatBalance('123456789', getDecimalsByNetwork(NETWORK_BITCOIN), 2), '1.23');
  assert.strictEqual(formatBalance('123456789', getDecimalsByNetwork(NETWORK_BITCOIN), 4), '1.2346'); // rounding up
});
