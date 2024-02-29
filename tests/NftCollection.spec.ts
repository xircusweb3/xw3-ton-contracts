import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, beginCell, fromNano, toNano } from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import { NftItem } from '../wrappers/NftItem';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NftCollection', () => {
    let code: Cell;
    let item: Cell;
    let itemAddr: Address;

    beforeAll(async () => {
        code = await compile('NftCollection');
        item = await compile('NftItem');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;    
    let nftCollection: SandboxContract<NftCollection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');
        user = await blockchain.treasury('user');        

        const params = {
            owner: deployer.address,
            content: 'ipfs://NFT_COLLECTION_DATA',
            item: item,
            royalty: beginCell()
                .storeUint(0, 16)
                .storeUint(0, 16)
                .storeAddress(deployer.address)
                .endCell()
        }

        nftCollection = blockchain.openContract(NftCollection.createFromConfig(params, code));

        const deployResult = await nftCollection.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftCollection.address,
            deploy: true,
            success: true,
        });

    });

    // it('should deploy', async () => {
    //     // the check is done inside beforeEach
    //     // blockchain and nftCollection are ready to use
    // });

    it('should mint a new nft', async() => {

        const tx = await nftCollection.sendMint(deployer.getSender(), {
            queryId: 0,
            nftAmount: toNano('0.05'),
            nftId: 0,
            owner: user.address,
            contentUrl: 'ipfs://NFT_ONE_USER_ADDRESS',
            gas: toNano('0.1')
        })
        
        const metadata = await nftCollection.getCollectionData()
        itemAddr = await nftCollection.getItemAddr(0)

        console.log("TRANSACTION", tx)
        console.log("COLLECTION DATA", metadata, itemAddr)
    })

    it('get the nft item', async() => {
        const nftItem = blockchain.openContract(NftItem.createFromAddress(itemAddr))
        const itemData = await nftItem.getItemData()

        // console.log("NFT ITEM ADDR", nftItemAddr)
    })
});
