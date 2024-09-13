import React, { ChangeEvent, useCallback } from 'react';
import { Button, Input } from '@mui/joy';
import { usePurchaseForm } from '../../hooks/usePurchaseForm';
import Loading from '../../../../shared/ui/components/Loading/Loading';
import './PurchaseForm.scss';

const PurchaseForm: React.FC = () => {
    const { amountToSend, setAmountToSend, yeetReceived, isButtonDisabled, handlePurchase, loading } =
        usePurchaseForm();

    const handleAmountChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setAmountToSend(Number(e.target.value));
        },
        [setAmountToSend]
    );

    return (
        <div className="PurchaseFormWrapper">
            {loading ? (
                <Loading />
            ) : (
                <form onSubmit={handlePurchase}>
                    <Input
                        placeholder="You send (USDC)"
                        type="number"
                        value={amountToSend}
                        onChange={handleAmountChange}
                        required
                    />
                    <Input placeholder="You get ($YEET)" value={yeetReceived} readOnly />
                    <Button type="submit" disabled={isButtonDisabled}>
                        Purchase
                    </Button>
                </form>
            )}
        </div>
    );
};

export default React.memo(PurchaseForm);
