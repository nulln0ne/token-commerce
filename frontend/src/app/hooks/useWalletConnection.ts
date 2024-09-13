import { useConnectWallet as useWeb3ConnectWallet } from '@web3-onboard/react';

export const useWalletConnection = () => {
    const [{ wallet, connecting }, connect, disconnect] = useWeb3ConnectWallet();
    return { wallet, connecting, connect, disconnect };
};
