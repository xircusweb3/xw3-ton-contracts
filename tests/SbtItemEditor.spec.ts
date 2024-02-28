import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { SbtItemEditor } from '../wrappers/SbtItemEditor';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('SbtItemEditor', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SbtItemEditor');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sbtItemEditor: SandboxContract<SbtItemEditor>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sbtItemEditor = blockchain.openContract(SbtItemEditor.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sbtItemEditor.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sbtItemEditor.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sbtItemEditor are ready to use
    });
});
