import React from 'react';
import { Card, Typography, Box } from '@mui/joy';

interface PageProps {
    title: string;
    children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '500px',
                }}
            >
                <Typography level="h2" sx={{ marginBottom: '16px' }}>
                    {title}
                </Typography>
                {children}
            </Card>
        </Box>
    );
};

export default React.memo(Page);
