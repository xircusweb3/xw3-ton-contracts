import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SbtItemEditorConfig = {};

export function sbtItemEditorConfigToCell(config: SbtItemEditorConfig): Cell {
    return beginCell().endCell();
}

export class SbtItemEditor implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SbtItemEditor(address);
    }

    static createFromConfig(config: SbtItemEditorConfig, code: Cell, workchain = 0) {
        const data = sbtItemEditorConfigToCell(config);
        const init = { code, data };
        return new SbtItemEditor(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
