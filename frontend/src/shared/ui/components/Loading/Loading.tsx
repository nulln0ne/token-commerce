import React from 'react';
import { CircularProgress, Box } from '@mui/joy';

const Loading: React.FC = () => (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
    </Box>
);

export default React.memo(Loading);
