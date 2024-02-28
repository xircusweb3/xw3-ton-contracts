import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { XircusSoulBadgeItem } from '../wrappers/XircusSoulBadgeItem';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('XircusSoulBadgeItem', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('XircusSoulBadgeItem');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let xircusSoulBadgeItem: SandboxContract<XircusSoulBadgeItem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        xircusSoulBadgeItem = blockchain.openContract(XircusSoulBadgeItem.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await xircusSoulBadgeItem.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: xircusSoulBadgeItem.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and xircusSoulBadgeItem are ready to use
    });
});
