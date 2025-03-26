<img src="src/assets/img/icon-128.png" width="64"/>

# Layerz Wallet

Experience the future of Bitcoin with Layer2-focused wallet. Bitcoin-only, non-custodial, opensource

🌐 [https://layerzwallet.com](https://layerzwallet.com)

> **Developer Preview Release**
> This is an early access version for developers. Use with caution and report any issues you encounter.

## L2s supported (current and upcoming)

- [x] Bitcoin base layer
- [x] Rootstock
- [x] Botanix (testnet)
- [x] Citrea (testnet)
- [x] Strata (testnet)
- [ ] Liquid & Liquid assets
- [x] Ark (by ArkLabs) (testnet)
- [ ] RGB
- [ ] Lightning & Taproot assets

## Other features (current and upcoming)

- [ ] Hardware wallet support (single-sig & multi-sig)
- [ ] Code opensourced
- [ ] Bridging from base layer to Layer 2
- [ ] Swaps between Layers

## Installing and Running

- Check if your [Node.js](https://nodejs.org/) version is >= **22**.
- Run `npm install` to install the dependencies.
- Run `npm start`
- Load your extension on Chrome following:
  1.  Access `chrome://extensions/`
  2.  Check `Developer mode`
  3.  Click on `Load unpacked extension`
  4.  Select the `build` folder.

## Tests

- `npm run unit`
- `npm run integration`

## e2e

- `npx playwright install`
- `npx playwright install-deps`
- `./utils/add-sepolia.sh`
- `npm run e2e`
