import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type XircusSoulBadgeItemConfig = {};

export function xircusSoulBadgeItemConfigToCell(config: XircusSoulBadgeItemConfig): Cell {
    return beginCell().endCell();
}

export class XircusSoulBadgeItem implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new XircusSoulBadgeItem(address);
    }

    static createFromConfig(config: XircusSoulBadgeItemConfig, code: Cell, workchain = 0) {
        const data = xircusSoulBadgeItemConfigToCell(config);
        const init = { code, data };
        return new XircusSoulBadgeItem(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
