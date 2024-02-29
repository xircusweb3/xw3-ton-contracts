import { Address, beginCell, Cell,  Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftCollectionConfig = {
    owner: Address,
    item: Cell,
    content: string,
    royalty: Cell
}

export type MintParams = {
    queryId: number | null,
    owner: Address,
    nftId: number,
    nftAmount: bigint,
    contentUrl: string,
    gas: bigint,
}

export function nftCollectionConfigToCell(config: NftCollectionConfig): Cell {

    const content = beginCell()
        .storeRef(beginCell().storeStringTail(config.content).endCell())
        .endCell()

    return beginCell()
        .storeAddress(config.owner)
        .storeUint(0, 64)
        .storeRef(content)
        .storeRef(config.item)
        .storeRef(config.royalty)
        .endCell()
}

export class NftCollection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftCollection(address);
    }

    static createFromConfig(config: NftCollectionConfig, code: Cell, workchain = 0) {
        const data = nftCollectionConfigToCell(config);
        const init = { code, data };
        return new NftCollection(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
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
    
    async getItemAddr(provider: ContractProvider, nftId: number) {
        let { stack } = await provider.get('get_nft_address_by_index', [{ type: 'int', value: BigInt(nftId) }]);
        return stack.readAddress()
    }

    static mintMessage(params: MintParams) {

        const uriContent = beginCell().storeStringTail(params.contentUrl).endCell()

        const body = beginCell()
            .storeAddress(params.owner)
            .storeRef(beginCell().storeRef(uriContent).endCell())
            .storeAddress(params.owner)
            .storeRef(beginCell().storeRef(uriContent).endCell())            
            .endCell()

        return beginCell()
            .storeUint(1, 32)                       // Mint Operation
            .storeUint(params.queryId || 0, 64)     // Query ID
            .storeUint(params.nftId, 64)            // NFT ID
            .storeCoins(params.nftAmount)           // Initial Balance
            .storeRef(body)                         // Mint Body
            .endCell()
    }

    async sendMint(
        provider: ContractProvider, 
        via: Sender, 
        params: MintParams
    ) {
        await provider.internal(via, {
            value: params.gas,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: NftCollection.mintMessage(params),
        })
    }
}
