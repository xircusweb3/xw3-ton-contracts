import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { NftFixedPriceSale } from '../wrappers/NftFixedPriceSale';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NftFixedPriceSale', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NftFixedPriceSale');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftFixedPriceSale: SandboxContract<NftFixedPriceSale>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftFixedPriceSale = blockchain.openContract(NftFixedPriceSale.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nftFixedPriceSale.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftFixedPriceSale.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftFixedPriceSale are ready to use
    });
});
