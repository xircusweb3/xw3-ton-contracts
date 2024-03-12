import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftMarketWalletConfig = {};

export function nftMarketWalletConfigToCell(config: NftMarketWalletConfig): Cell {
    return beginCell().endCell();
}

export class NftMarketWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftMarketWallet(address);
    }

    static createFromConfig(config: NftMarketWalletConfig, code: Cell, workchain = 0) {
        const data = nftMarketWalletConfigToCell(config);
        const init = { code, data };
        return new NftMarketWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
