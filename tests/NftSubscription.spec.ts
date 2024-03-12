import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { NftSubscription } from '../wrappers/NftSubscription';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NftSubscription', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NftSubscription');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftSubscription: SandboxContract<NftSubscription>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftSubscription = blockchain.openContract(NftSubscription.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nftSubscription.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftSubscription.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftSubscription are ready to use
    });
});
