import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { SbtCollection } from '../wrappers/SbtCollection';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('SbtCollection', () => {
    let code: Cell;
    let item: Cell;

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

        console.log("DATA", { data , versionType})

        // the check is done inside beforeEach
        // blockchain and sbtCollection are ready to use
    });

});
