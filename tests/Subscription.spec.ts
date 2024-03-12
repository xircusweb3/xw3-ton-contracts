import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Subscription } from '../wrappers/Subscription';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Subscription', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Subscription');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let subscription: SandboxContract<Subscription>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        subscription = blockchain.openContract(Subscription.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await subscription.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: subscription.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and subscription are ready to use
    });
});
