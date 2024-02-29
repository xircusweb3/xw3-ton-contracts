import { Address, beginCell, Cell,  Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftCollectionConfig = {
    owner: Address,
    content: Cell,
    nftItem: Cell,
    royalty: Cell
}

export function nftCollectionConfigToCell(config: NftCollectionConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeUint(0, 64)
        .storeRef(config.content)
        .storeRef(config.nftItem)
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

    static mintMessage(nftAmount: bigint, nftId: number, content: string) {
        const uriContent = beginCell().storeStringTail(content).endCell()
        return beginCell()
            .storeUint(1, 32)               // Mint Operation
            .storeUint(0, 64)               // Query ID
            .storeUint(nftId, 64)           // NFT ID
            .storeCoins(nftAmount)          // Initial Balance
            .storeRef(uriContent)           // IPFS URL
            .endCell()
    }

    async sendMint(
        provider: ContractProvider, 
        via: Sender, 
        opts: {
            nftAmount: bigint, 
            nftId: number, 
            content: string, 
            value: bigint  
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: NftCollection.mintMessage(opts.nftAmount, opts.nftId, opts.content),
        })
    }
}
