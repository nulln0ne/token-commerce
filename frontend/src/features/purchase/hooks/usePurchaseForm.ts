import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWalletConnection } from '../../../app/hooks/useWalletConnection';
import { fetchTokenPrice, approveToken, processSale } from '../abi/purchaseService';
import logger from '../../../shared/lib/logger';
import { ERC20_ADDRESS } from '../../../app/config';
import { useMemo } from 'react';

export const usePurchaseForm = () => {
    const [amountToSend, setAmountToSend] = useState<number>(0);
    const [yeetReceived, setYeetReceived] = useState<string>('0');
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [pricePerToken, setPricePerToken] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { wallet } = useWalletConnection();

    useEffect(() => {
        const fetchPrice = async () => {
            if (!wallet) return;

            try {
                const provider = new ethers.providers.Web3Provider(wallet.provider);
                const price = await fetchTokenPrice(provider);
                setPricePerToken(price);
                logger.info(`Fetched token price: ${price}`);
            } catch (error) {
                logger.error('Failed to fetch token price:', error);
                setPricePerToken(null);
            }
        };

        fetchPrice();
    }, [wallet]);

    const tokensToReceive = useMemo(() => {
        if (pricePerToken && amountToSend > 0) {
            return (amountToSend / pricePerToken).toFixed(6);
        }
        return '0';
    }, [amountToSend, pricePerToken]);

    useEffect(() => {
        setYeetReceived(tokensToReceive);
        setIsButtonDisabled(!(pricePerToken && amountToSend > 0));
    }, [tokensToReceive, pricePerToken, amountToSend]);

    const handlePurchase = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();
            setLoading(true);

            if (!wallet) {
                logger.error('No wallet connected');
                setLoading(false);
                return;
            }

            try {
                const provider = new ethers.providers.Web3Provider(wallet.provider);
                const signer = provider.getSigner();
                const amountInWei = ethers.utils.parseUnits(amountToSend.toString(), 6);
                const gasLimit = ethers.utils.hexlify(300000);

                const txApprove = await approveToken(signer, amountInWei);
                await txApprove.wait();
                logger.info('Approval successful', txApprove);

                const buyerAddress = wallet.accounts[0].address;
                const tx = await processSale(signer, ERC20_ADDRESS, buyerAddress, amountInWei, gasLimit);
                await tx.wait();

                logger.info('Purchase successful', tx);
            } catch (error) {
                logger.error('Purchase failed:', error);
            } finally {
                setLoading(false);
            }
        },
        [wallet, amountToSend]
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
