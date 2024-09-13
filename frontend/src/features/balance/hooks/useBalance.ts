import { useEffect, useState } from 'react';
import { useUserStore } from '../../../app/stores/userStore';
import { getBalance } from '../api/getBalance';
import logger from '../../../shared/lib/logger';

export const useBalance = () => {
    const walletAddress = useUserStore((state) => state.walletAddress);
    const balance = useUserStore((state) => state.balance);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            if (walletAddress) {
                try {
                    setLoading(true);
                    await getBalance(walletAddress);
                    setError(null);
                } catch (err) {
                    setError('Failed to fetch balance.');
                    logger.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [walletAddress]);

    return { balance, loading, error };
};
