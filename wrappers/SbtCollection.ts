import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SbtCollectionConfig = {
    owner: Address,
    sbtItem: Cell,
    content: string,
    versionType: string
}

export type MintParams = {
    queryId: number | null,
    owner: Address,
    nftId: number,
    nftAmount: bigint,
    contentUrl: string,
    gas: bigint,
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

    static mintMessage(params: MintParams) {
        const uriContent = beginCell().storeStringTail(params.contentUrl).endCell()

        // ;;  uint64 index
        // ;;  MsgAddressInt collection_address
        // ;;  MsgAddressInt owner_address
        // ;;  cell content
        // ;;  MsgAddressInt authority_address
        // ;;  uint64 revoked_at

        const body = beginCell()
            .storeAddress(params.owner)
            .storeRef(beginCell().storeRef(uriContent).endCell())
            .storeAddress(params.owner)
            .storeUint(0, 64)
            .endCell()

        return beginCell()
            .storeUint(1, 32)                       // Mint Operation
            .storeUint(params.queryId || 0, 64)     // Query ID
            .storeUint(params.nftId, 64)           // NFT ID
            .storeCoins(params.nftAmount)          // Initial Balance
            .storeRef(body)                         // IPFS URL
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
            body: SbtCollection.mintMessage(params),
        })
    }    

    async getItemAddr(provider: ContractProvider, nftId: number) {
        let { stack } = await provider.get('get_nft_address_by_index', [{ type: 'int', value: BigInt(nftId) }]);
        return stack.readAddress()
    }

}
