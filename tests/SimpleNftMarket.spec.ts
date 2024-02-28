import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { SimpleNftMarket } from '../wrappers/SimpleNftMarket';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('SimpleNftMarket', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SimpleNftMarket');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let simpleNftMarket: SandboxContract<SimpleNftMarket>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        simpleNftMarket = blockchain.openContract(SimpleNftMarket.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await simpleNftMarket.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: simpleNftMarket.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and simpleNftMarket are ready to use
    });
});
