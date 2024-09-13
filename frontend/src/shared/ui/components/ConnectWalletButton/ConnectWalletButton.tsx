import React from 'react';
import { Button } from '@mui/joy';
import { truncateString } from '../../../lib/truncateString';
import { useConnectWallet } from '../../../../app/hooks/useConnectWallet';

const ConnectWalletButton: React.FC = () => {
    const { wallet, handleConnectWallet, isConnecting } = useConnectWallet();

    return (
        <Button onClick={handleConnectWallet} disabled={isConnecting} variant='outlined' color='warning'>
            {wallet ? truncateString(wallet.accounts[0]?.address || '', 6, 4) : 'Connect Wallet'}
        </Button>
    );
};

export default React.memo(ConnectWalletButton);
