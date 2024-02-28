import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type XircusSoulBadgeConfig = {};

export function xircusSoulBadgeConfigToCell(config: XircusSoulBadgeConfig): Cell {
    return beginCell().endCell();
}

export class XircusSoulBadge implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new XircusSoulBadge(address);
    }

    static createFromConfig(config: XircusSoulBadgeConfig, code: Cell, workchain = 0) {
        const data = xircusSoulBadgeConfigToCell(config);
        const init = { code, data };
        return new XircusSoulBadge(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
