import { LayerzStorage } from './layerz-storage';

/**
 * Basically mimics regular LayerzStorage, the difference is only meaningful on mobile
 * where we have secure keystore
 */

export const SecureStorage = LayerzStorage;
