import { getChainIdByNetwork, getNetworkByChainId } from '../../models/network-getters';
import assert from 'assert';
import { NETWORK_BITCOIN, NETWORK_ROOTSTOCK } from '../../types/networks';
import { test } from 'vitest';

test('getChainIdByNetworkId()', async () => {
  assert.strictEqual(getChainIdByNetwork(NETWORK_BITCOIN), '0x0');
  assert.strictEqual(getChainIdByNetwork(NETWORK_ROOTSTOCK), '0x1e');
});

test('getNetworkIdByChainId()', async () => {
  assert.strictEqual(getNetworkByChainId('0x1e'), NETWORK_ROOTSTOCK);
  assert.strictEqual(getNetworkByChainId('0xdeadbabe'), undefined);
});
