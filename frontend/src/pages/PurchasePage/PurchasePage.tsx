import React, { Suspense } from 'react';
import Page from '../../shared/ui/components/Page/Page';
import Loading from '../../shared/ui/components/Loading/Loading';

const PurchaseForm = React.lazy(() => import('../../features/purchase/ui/PurchaseForm/PurchaseForm'));

const PurchasePage: React.FC = () => {
    return (
        <Page title="Purchase">
            <Suspense fallback={<Loading />}>
                <PurchaseForm />
            </Suspense>
        </Page>
    );
};

export default PurchasePage;
