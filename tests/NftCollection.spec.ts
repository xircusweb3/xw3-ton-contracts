import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, beginCell, toNano } from '@ton/core';
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

    it('checks for any data', async() => {
        console.log("COLLECTION DATA", await nftCollection.getCollectionData())
    })
});
