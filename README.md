# Xircus

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`

### References
- https://github.com/ton-blockchain/token-contract/tree/main
- https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources
- https://github.com/romanovichim/TonFunClessons_Eng
- https://github.com/ton-blockchain/token-contract/tree/main/ft
- https://github.com/ton-blockchain/liquid-staking-contract/tree/main/contracts
- https://github.com/somewallet/ton_nft_dapp/blob/master/contracts/freelancers_nft.fc
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/messages