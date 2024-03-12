import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { NftAuction } from '../wrappers/NftAuction';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NftAuction', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NftAuction');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftAuction: SandboxContract<NftAuction>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftAuction = blockchain.openContract(NftAuction.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nftAuction.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftAuction.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftAuction are ready to use
    });
});
