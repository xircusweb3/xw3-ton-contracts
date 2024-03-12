import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftSubscriptionConfig = {};

export function nftSubscriptionConfigToCell(config: NftSubscriptionConfig): Cell {
    return beginCell().endCell();
}

export class NftSubscription implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftSubscription(address);
    }

    static createFromConfig(config: NftSubscriptionConfig, code: Cell, workchain = 0) {
        const data = nftSubscriptionConfigToCell(config);
        const init = { code, data };
        return new NftSubscription(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
