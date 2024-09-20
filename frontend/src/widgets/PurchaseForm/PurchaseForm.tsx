import React, { ChangeEvent, useCallback } from 'react';
import { Button, Input, Box } from '@mui/joy';
import { usePurchaseForm } from '../../features/purchase/hooks/usePurchaseForm';
import Loading from '../../shared/ui/components/Loading/Loading';

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
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}
            className="PurchaseFormWrapper"
        >
            {loading ? (
                <Loading />
            ) : (
                <Box
                    component="form"
                    onSubmit={handlePurchase}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        width: '100%',
                    }}
                >
                    <Input
                        placeholder="You send (USDC)"
                        type="number"
                        value={amountToSend}
                        onChange={handleAmountChange}
                        required
                        sx={{
                            width: '100%',
                        }}
                    />
                    <Input
                        placeholder="You get ($YEET)"
                        value={yeetReceived}
                        readOnly
                        sx={{
                            width: '100%',
                        }}
                    />
                    <Button type="submit" disabled={isButtonDisabled}>
                        Purchase
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default React.memo(PurchaseForm);
