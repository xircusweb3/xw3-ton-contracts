import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { TokenStaking } from '../wrappers/TokenStaking';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('TokenStaking', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('TokenStaking');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tokenStaking: SandboxContract<TokenStaking>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tokenStaking = blockchain.openContract(TokenStaking.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await tokenStaking.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tokenStaking.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tokenStaking are ready to use
    });
});
