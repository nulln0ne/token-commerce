import React from 'react';
import ConnectWalletButton from '../../shared/ui/components/ConnectWalletButton/ConnectWalletButton';
import Page from '../../shared/ui/components/Page/Page';

const MainPage: React.FC = () => {
    return (
        <Page title="Please connect your wallet">
            <ConnectWalletButton />
        </Page>
    );
};

export default MainPage;
