import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftSaleConfig = {};

export function nftSaleConfigToCell(config: NftSaleConfig): Cell {
    return beginCell().endCell();
}

export class NftSale implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftSale(address);
    }

    static createFromConfig(config: NftSaleConfig, code: Cell, workchain = 0) {
        const data = nftSaleConfigToCell(config);
        const init = { code, data };
        return new NftSale(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
