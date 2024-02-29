import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SbtItemConfig = {};

export function sbtItemConfigToCell(config: SbtItemConfig): Cell {
    return beginCell().endCell();
}

export class SbtItem implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SbtItem(address);
    }

    static createFromConfig(config: SbtItemConfig, code: Cell, workchain = 0) {
        const data = sbtItemConfigToCell(config);
        const init = { code, data };
        return new SbtItem(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getAuthorityAddr(provider: ContractProvider) {
        const { stack } = await provider.get('get_authority_address', [])
        return stack.readAddress()
    }


    async getItemData(provider: ContractProvider) {
        const { stack } = await provider.get('get_nft_data', [])
        const init = stack.readNumber()
        const nftId = stack.readNumber()
        const collection = stack.readAddress()
        const authority = stack.readAddress()
        const content = stack.readString()
        return {
            init,
            nftId,
            collection,
            authority,
            content
        }       
    }    
}
