import React from 'react';
import { useBalance } from '../../features/balance/hooks/useBalance';
import Page from '../../shared/ui/components/Page/Page';
import BalanceTable from '../../widgets/BalanceTable/BalanceTable';
import { Typography } from '@mui/joy';

const BalancePage: React.FC = () => {
    const { balance, loading, error } = useBalance();

    return (
        <Page title="Balance">
            {error ? (
                <Typography color="danger">{error}</Typography>
            ) : (
                <BalanceTable balance={balance} loading={loading} />
            )}
        </Page>
    );
};

export default React.memo(BalancePage);
