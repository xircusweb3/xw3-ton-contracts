import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, toNano } from '@ton/core';
import { SbtCollection } from '../wrappers/SbtCollection';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { SbtItem } from '../wrappers/SbtItem';

describe('SbtCollection', () => {
    let code: Cell;
    let item: Cell;
    let itemAddr: Address;

    beforeAll(async () => {
        code = await compile('SbtCollection')
        item = await compile('SbtItem')
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sbtCollection: SandboxContract<SbtCollection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        const params = {
            owner: deployer.address,
            sbtItem: item,
            content: 'ipfs://SBT_CONTENT',
            versionType: 'SBT:1'
        }

        sbtCollection = blockchain.openContract(SbtCollection.createFromConfig(params, code));

        const deployResult = await sbtCollection.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sbtCollection.address,
            deploy: true,
            success: true,
        });

        // console.log("DEPLOY RESULT", deployResult)
        
    });

    it('should deploy', async () => {
        const data = await sbtCollection.getCollectionData()
        const versionType = await sbtCollection.getVersionType()
        console.log("SBT DATA", data, versionType)
    });

    it('deploys an sbt', async() => {

        await sbtCollection.sendMint(deployer.getSender(), {
            queryId: 0,
            nftAmount: toNano('0.05'),
            nftId: 0,
            owner: sbtCollection.address,
            contentUrl: 'ipfs://NFT_ONE_USER_ADDRESS',
            gas: toNano('0.1')
        })

        itemAddr = await sbtCollection.getItemAddr(0)
        const sbtItem = blockchain.openContract(SbtItem.createFromAddress(itemAddr))
        const data = await sbtItem.getItemData()
        console.log("SBT ITEM DATA", data)        

    })

});
