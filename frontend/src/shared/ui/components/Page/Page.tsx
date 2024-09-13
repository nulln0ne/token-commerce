import React from 'react';
import { Card, Typography } from '@mui/joy';
import './Page.scss';

interface PageProps {
    title: string;
    children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
    return (
        <div className="Page">
            <Card className="Page__card">
                <Typography level="h2" className="Page__card-title">{title}</Typography>
                {children}
            </Card>
        </div>
    );
};

export default React.memo(Page);
