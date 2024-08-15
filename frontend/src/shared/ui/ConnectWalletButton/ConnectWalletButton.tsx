import React from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { Button } from '@mui/joy';
import { truncateString } from '@/shared/lib/truncateString';
import { ethers } from 'ethers';
import axios from 'axios';

const ConnectWalletButton: React.FC = () => {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

    const handleButtonClick = async () => {
        if (wallet) {
            await disconnect({ label: wallet.label });
        } else {
            const connectedWallet = await connect();
            if (connectedWallet && connectedWallet[0]) {
                const walletAddress = connectedWallet[0].accounts[0]?.address;

                if (!walletAddress) {
                    console.error('Failed to retrieve wallet address.');
                    return;
                }

                try {
                    console.log('Requesting nonce from the backend...');
                    const { data: nonceResponse } = await axios.post('http://localhost:3000/auth/get-nonce', {
                        walletAddress,
                    });
                    const { nonce } = nonceResponse;

                    if (!nonce) {
                        throw new Error('Nonce not received. Ensure the backend is correctly returning the nonce.');
                    }

                    const nonceMessage = `Sign this nonce: ${nonce}`;
                    console.log(`Nonce message to sign: ${nonceMessage}`);

                    console.log('Signing the nonce...');
                    const provider = new ethers.providers.Web3Provider(connectedWallet[0].provider);
                    const signer = provider.getSigner();
                    const signature = await signer.signMessage(nonceMessage);
                    console.log(`Generated signature: ${signature}`);

                    console.log('Sending authentication request to the backend...');
                    const authResponse = await axios.post('http://localhost:3000/auth', {
                        walletAddress,
                        signature,
                    });

                    console.log('Authentication successful:', authResponse.data);
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error('Error occurred during authentication:', error.response?.data || error.message);
                    } else {
                        console.error('Unexpected error:', (error as Error).message);
                    }
                }
            }
        }
    };

    return (
        <Button onClick={handleButtonClick} disabled={connecting} variant="soft" color="warning">
            {connecting ? 'Connecting...' : wallet ? truncateString(wallet.accounts[0]?.address) : 'Connect Wallet'}
        </Button>
    );
};

export default ConnectWalletButton;
