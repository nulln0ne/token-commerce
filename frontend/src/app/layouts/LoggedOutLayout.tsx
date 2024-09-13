import React from 'react';
import { Outlet } from 'react-router-dom';

const LoggedOutLayout: React.FC = () => {
    return (
        <div>
            <main className='Main__loggedOut'>
                <Outlet />
            </main>
        </div>
    );
};

export default LoggedOutLayout;
