import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { NftSale } from '../wrappers/NftSale';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NftSale', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NftSale');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftSale: SandboxContract<NftSale>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftSale = blockchain.openContract(NftSale.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nftSale.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftSale.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftSale are ready to use
    });
});
