import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type JettonSaleConfig = {};

export function jettonSaleConfigToCell(config: JettonSaleConfig): Cell {
    return beginCell().endCell();
}

export class JettonSale implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonSale(address);
    }

    static createFromConfig(config: JettonSaleConfig, code: Cell, workchain = 0) {
        const data = jettonSaleConfigToCell(config);
        const init = { code, data };
        return new JettonSale(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
