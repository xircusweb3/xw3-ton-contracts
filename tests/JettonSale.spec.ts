import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { JettonSale } from '../wrappers/JettonSale';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('JettonSale', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('JettonSale');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let jettonSale: SandboxContract<JettonSale>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        jettonSale = blockchain.openContract(JettonSale.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await jettonSale.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonSale.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonSale are ready to use
    });
});
