import { ethers } from 'ethers';
import SaleContractABI from '../../../shared/abi/SaleContractABI.json';
import ERC20ABI from '../../../shared/abi/ERC20ABI.json';
import { SALE_CONTRACT_ADDRESS, ERC20_ADDRESS } from '../../../app/config';

export const fetchTokenPrice = async (provider: ethers.providers.Web3Provider): Promise<number> => {
    const erc20Contract = new ethers.Contract(ERC20_ADDRESS, ERC20ABI, provider);
    const tokenPrice = await erc20Contract.getPrice();
    return parseFloat(ethers.utils.formatUnits(tokenPrice, 6));
};

export const approveToken = async (
    signer: ethers.Signer,
    amount: ethers.BigNumber
): Promise<ethers.providers.TransactionResponse> => {
    const erc20Contract = new ethers.Contract(ERC20_ADDRESS, ERC20ABI, signer);
    return erc20Contract.approve(SALE_CONTRACT_ADDRESS, amount);
};

export const processSale = async (
    signer: ethers.Signer,
    saleableToken: string,
    buyerAddress: string,
    amount: ethers.BigNumber,
    gasLimit: string
): Promise<ethers.providers.TransactionResponse> => {
    const saleContract = new ethers.Contract(SALE_CONTRACT_ADDRESS, SaleContractABI, signer);
    return saleContract.processSale(saleableToken, buyerAddress, amount, {
        gasLimit,
    });
};
