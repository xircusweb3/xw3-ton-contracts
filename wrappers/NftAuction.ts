import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftAuctionConfig = {};

export function nftAuctionConfigToCell(config: NftAuctionConfig): Cell {
    return beginCell().endCell();
}

export class NftAuction implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftAuction(address);
    }

    static createFromConfig(config: NftAuctionConfig, code: Cell, workchain = 0) {
        const data = nftAuctionConfigToCell(config);
        const init = { code, data };
        return new NftAuction(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
