import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, beginCell, fromNano, toNano } from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NftCollection', () => {
    let code: Cell;
    let item: Cell;

    beforeAll(async () => {
        code = await compile('NftCollection');
        item = await compile('NftItem');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftCollection: SandboxContract<NftCollection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        const params = {
            owner: deployer.address,
            content: beginCell()
                .storeRef(beginCell().storeStringTail('ipfs://TEST_CONTENT').endCell())
                .endCell(),
            nftItem: item,
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

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftCollection are ready to use
    });

    it('should mint a new nft', async() => {

        const balance = await deployer.getBalance()

        await nftCollection.sendMint(deployer.getSender(), {
            nftAmount: toNano('0.05'),
            nftId: 0,
            content: 'ipfs://ITEM_1',
            value: toNano('0.1')
        })
        
        await nftCollection.sendMint(deployer.getSender(), {
            nftAmount: toNano('0.05'),
            nftId: 1,
            content: 'ipfs://ITEM_1',
            value: toNano('0.1')
        })

        const collectionData = await nftCollection.getCollectionData()

        const item1Addr = await nftCollection.getItemAddr(1)

        const item2Addr = await nftCollection.getItemAddr(2)

        console.log("COLLECTION DATA", collectionData, item1Addr, item2Addr, fromNano(balance))

    })

    it('batch mint', async() => {

    })
});
