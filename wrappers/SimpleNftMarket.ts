import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SimpleNftMarketConfig = {};

export function simpleNftMarketConfigToCell(config: SimpleNftMarketConfig): Cell {
    return beginCell().endCell();
}

export class SimpleNftMarket implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SimpleNftMarket(address);
    }

    static createFromConfig(config: SimpleNftMarketConfig, code: Cell, workchain = 0) {
        const data = simpleNftMarketConfigToCell(config);
        const init = { code, data };
        return new SimpleNftMarket(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
