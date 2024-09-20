import { ethers } from 'ethers';
import SepoliaProvider from '../lib/sepoliaProvider';

export class BlockchainService {
    public async fetchTokenPrice(tokenAddress: string, tokenAbi: ethers.ContractInterface): Promise<number> {
        try {
            const contract = new ethers.Contract(tokenAddress, tokenAbi, SepoliaProvider);
            const price = await contract.getPrice();
            return parseFloat(ethers.utils.formatUnits(price, 6));
        } catch (error) {
            console.error(`Error fetching token price from ${tokenAddress}:`, error);
            throw new Error('Failed to fetch token price');
        }
    }

    public async approveToken(
        signer: ethers.Signer,
        amount: ethers.BigNumber,
        saleContractAddress: string,
        tokenAddress: string,
        tokenAbi: ethers.ContractInterface
    ): Promise<ethers.providers.TransactionResponse> {
        try {
            const contract = new ethers.Contract(tokenAddress, tokenAbi, signer);
            const tx = await contract.approve(saleContractAddress, amount);
            await tx.wait();
            return tx;
        } catch (error) {
            console.error(`Error approving tokens for contract ${saleContractAddress}:`, error);
            throw new Error('Failed to approve tokens');
        }
    }

    public async processSale(
        signer: ethers.Signer,
        saleableToken: string,
        buyerAddress: string,
        amount: ethers.BigNumber,
        gasLimit: ethers.BigNumberish,
        saleContractAddress: string,
        saleContractAbi: ethers.ContractInterface
    ): Promise<ethers.providers.TransactionResponse> {
        try {
            const contract = new ethers.Contract(saleContractAddress, saleContractAbi, signer);
            const tx = await contract.processSale(saleableToken, buyerAddress, amount, { gasLimit });
            await tx.wait();
            return tx;
        } catch (error) {
            console.error(`Error processing sale for buyer ${buyerAddress}:`, error);
            throw new Error('Failed to process sale');
        }
    }
}
