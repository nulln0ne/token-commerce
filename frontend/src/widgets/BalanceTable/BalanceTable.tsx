import React from 'react';
import { Table } from '@mui/joy';
import Loading from '../../shared/ui/components/Loading/Loading';

interface BalanceTableProps {
    balance: number | null;
    loading: boolean;
}

const BalanceTable: React.FC<BalanceTableProps> = ({ balance, loading }) => {
    if (loading) {
        return <Loading />;
    }

    return (
        <Table aria-label="balance table" className="BalanceTable">
            <thead>
                <tr>
                    <th>$YEET</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{balance !== null ? balance : 'No balance available'}</td>
                </tr>
            </tbody>
        </Table>
    );
};

export default React.memo(BalanceTable);
