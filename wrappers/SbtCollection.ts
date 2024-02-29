import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SbtCollectionConfig = {
    owner: Address,
    sbtItem: Cell,
    content: string,
    versionType: string
}

export function sbtCollectionConfigToCell(config: SbtCollectionConfig): Cell {

    const content = beginCell()
        .storeRef(beginCell().storeStringTail(config.content).endCell())
        .endCell()

    const versionType = beginCell()
        .storeRef(beginCell().storeStringTail(config.versionType).endCell())
        .endCell()

    return beginCell()
        .storeAddress(config.owner)
        .storeUint(0, 64)
        .storeRef(content)
        .storeRef(config.sbtItem)
        .storeRef(versionType)
        .endCell();
}

export class SbtCollection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SbtCollection(address);
    }

    static createFromConfig(config: SbtCollectionConfig, code: Cell, workchain = 0) {
        const data = sbtCollectionConfigToCell(config);
        const init = { code, data };
        return new SbtCollection(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getVersionType(provider: ContractProvider) {
        let { stack } = await provider.get('get_version_type', []);
        let content = stack.readString();
        return content
    }  

    async getCollectionData(provider: ContractProvider) {
        let { stack } = await provider.get('get_collection_data', []);
        let nextItem = stack.readNumber();
        let content = stack.readString();
        let owner = stack.readAddress();
        return {
            nextItem,
            content,
            owner
        }
    }  
}
