import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type TokenStakingConfig = {};

export function tokenStakingConfigToCell(config: TokenStakingConfig): Cell {
    return beginCell().endCell();
}

export class TokenStaking implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new TokenStaking(address);
    }

    static createFromConfig(config: TokenStakingConfig, code: Cell, workchain = 0) {
        const data = tokenStakingConfigToCell(config);
        const init = { code, data };
        return new TokenStaking(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
