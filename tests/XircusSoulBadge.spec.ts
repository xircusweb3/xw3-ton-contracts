import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { XircusSoulBadge } from '../wrappers/XircusSoulBadge';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('XircusSoulBadge', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('XircusSoulBadge');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let xircusSoulBadge: SandboxContract<XircusSoulBadge>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        xircusSoulBadge = blockchain.openContract(XircusSoulBadge.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await xircusSoulBadge.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: xircusSoulBadge.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and xircusSoulBadge are ready to use
    });
});
