import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftFixedPriceSaleConfig = {};

export function nftFixedPriceSaleConfigToCell(config: NftFixedPriceSaleConfig): Cell {
    return beginCell().endCell();
}

export class NftFixedPriceSale implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftFixedPriceSale(address);
    }

    static createFromConfig(config: NftFixedPriceSaleConfig, code: Cell, workchain = 0) {
        const data = nftFixedPriceSaleConfigToCell(config);
        const init = { code, data };
        return new NftFixedPriceSale(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
