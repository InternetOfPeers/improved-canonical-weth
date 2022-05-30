# Improved Canonical Wrapped Ether

This contract is an improvement to the Canonical [W-ETH](https://weth.io/) package (original post here [https://blog.0xproject.com/canonical-weth-a9aa7d0279dd](https://blog.0xproject.com/canonical-weth-a9aa7d0279dd)).

## Description

Canonical Wrapped Ether ([0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)) has at least two major flaws:

- You can lock your WETH in the contract (at 2022.05.29, they are ~644 ethers and counting)
- You cannot recover other tokens sent to this contract

It has one minor issue as well:

- It uses a custom event for minting, so it emits `Deposit` instead of `Transfer` from `address(0)` when minting and `Withdrawal` instead of `Transfer` to `address(0)` when burning tokens. Not too big an issue indeed, but the contract wants to be a standard EIP20 token, so better to avoid custom events.

Wrapped Ether 911 fixes those flaws:

- You cannot send WETH911 to the contract (tx reverts)
- Anyone can recover lost tokens assigned to this contract (happy front running to everybody ^^)
- The contract emits {Transfer} events when minting or burning WETH911

## Deployed contract addresses

- Mainnet: [0x6be7ef70b35fdb9042d704c920d003b414385c76](https://etherscan.io/token/0x6be7ef70b35fdb9042d704c920d003b414385c76)
- Goerli: [0x1989920574186c5564f89850740b5181770f599f](https://goerli.etherscan.io/address/0x1989920574186c5564f89850740b5181770f599f)
- Kovan: [0x914179daf1e1edcd052eb4096a622fbabaa37a8b](https://kovan.etherscan.io/address/0x914179daf1e1edcd052eb4096a622fbabaa37a8b)
- Ropsten: [0x7c44b54fc7da66d50e39799be22caba38ac60d94](https://ropsten.etherscan.io/address/0x7c44b54fc7da66d50e39799be22caba38ac60d94)
- Rinkeby: [0xb31700e30f03a0a1c54411f54cb5d5ac94a80ab8](https://rinkeby.etherscan.io/address/0xb31700e30f03a0a1c54411f54cb5d5ac94a80ab8)

## Setup

You need [Truffle](https://trufflesuite.com/) to run tests for this smart contract:

```sh
npm install -g truffle
```

## Tests

To test the smart contract run:

```sh
$ truffle test

Using network 'test'.

Compiling your contracts...
===========================
> Compiling .\contracts\Migrations.sol
> Compiling .\contracts\WETH911.sol
> Compiled successfully using:
   - solc: 0.8.14+commit.80d49f37.Emscripten.clang

  Contract: WETH911
    ✔ should start without tokens
    ✔ should not be able to send WETH911 tokens (1341ms)
    ✔ should mint tokens (1085ms)
    ✔ should not allow the contract to receive WETH911 (1119ms)
    ✔ should transfer tokens (1189ms)
    ✔ should burn tokens and get ethers back (1092ms)


  6 passing (6s)
```
