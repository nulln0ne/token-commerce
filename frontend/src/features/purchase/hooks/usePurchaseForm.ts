import { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import logger from '../../../shared/lib/logger';
import { useConnectWallet } from '@web3-onboard/react';
import { ERC20_ADDRESS, SALE_CONTRACT_ADDRESS } from '../../../app/config';
import { BlockchainService } from '../../../shared/services/blockchainService';
import ERC20ABI from '../../../shared/abi/ERC20ABI.json';
import SaleContractABI from '../../../shared/abi/SaleContractABI.json';

export const usePurchaseForm = () => {
    const [{ wallet }] = useConnectWallet();
    const [amountToSend, setAmountToSend] = useState<number>(0);
    const [yeetReceived, setYeetReceived] = useState<string>('0');
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [pricePerToken, setPricePerToken] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const blockchainService = useMemo(() => new BlockchainService(), []);

    useEffect(() => {
        const fetchPrice = async () => {
            if (!wallet || !wallet.accounts.length) return;

            try {
                const price = await blockchainService.fetchTokenPrice(ERC20_ADDRESS, ERC20ABI);
                setPricePerToken(price);
                logger.info(`Fetched token price: ${price}`);
            } catch (error) {
                logger.error('Failed to fetch token price:', error);
                setPricePerToken(null);
            }
        };

        fetchPrice();
    }, [wallet, blockchainService]);

    const tokensToReceive = useMemo(() => {
        return pricePerToken && amountToSend > 0 ? (amountToSend / pricePerToken).toFixed(6) : '0';
    }, [amountToSend, pricePerToken]);

    useEffect(() => {
        setYeetReceived(tokensToReceive);
        setIsButtonDisabled(!(pricePerToken && amountToSend > 0));
    }, [tokensToReceive, pricePerToken, amountToSend]);

    const handlePurchase = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();
            setLoading(true);

            if (!wallet || !wallet.accounts.length) {
                logger.error('No wallet connected or no accounts available');
                setLoading(false);
                return;
            }

            try {
                const provider = new ethers.providers.Web3Provider(wallet.provider);
                const signer = provider.getSigner();
                const amountInWei = ethers.utils.parseUnits(amountToSend.toString(), 6);
                const gasLimit = ethers.utils.hexlify(300000);

                const txApprove = await blockchainService.approveToken(
                    signer,
                    amountInWei,
                    SALE_CONTRACT_ADDRESS,
                    ERC20_ADDRESS,
                    ERC20ABI
                );
                await txApprove.wait();
                logger.info('Approval successful', txApprove);

                const buyerAddress = wallet.accounts[0].address;

                const tx = await blockchainService.processSale(
                    signer,
                    ERC20_ADDRESS,
                    buyerAddress,
                    amountInWei,
                    gasLimit,
                    SALE_CONTRACT_ADDRESS,
                    SaleContractABI
                );
                await tx.wait();

                logger.info('Purchase successful', tx);
            } catch (error) {
                logger.error('Purchase failed:', error);
            } finally {
                setLoading(false);
            }
        },
        [wallet, amountToSend, blockchainService]
    );

    return {
        amountToSend,
        setAmountToSend,
        yeetReceived,
        isButtonDisabled,
        handlePurchase,
        loading,
    };
};
