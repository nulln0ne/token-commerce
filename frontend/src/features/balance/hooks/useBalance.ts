import { useEffect, useMemo, useState } from 'react';
import logger from '../../../shared/lib/logger';
import { BalanceService } from '../../../shared/services/balanceService';
import { useUserStore } from '../../../shared/stores/userStore';

export const useBalance = () => {
    const walletAddress = useUserStore((state) => state.walletAddress);
    const balance = useUserStore((state) => state.balance);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const balanceService = useMemo(() => new BalanceService(), []);

    useEffect(() => {
        const fetchBalance = async () => {
            if (walletAddress) {
                try {
                    setLoading(true);
                    await balanceService.getBalance(walletAddress);
                    setError(null);
                } catch {
                    setError('Failed to fetch balance.');
                    logger.error('Failed to fetch balance:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [walletAddress, balanceService, error]);

    return { balance, loading, error };
};
