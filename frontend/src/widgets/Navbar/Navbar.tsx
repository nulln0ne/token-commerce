import React from 'react';
import ConnectWalletButton from '../../shared/ui/components/ConnectWalletButton/ConnectWalletButton';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';

const Navbar: React.FC = () => {
    return (
        <div className="Navbar">
            <NavLink to="/balance" className={({ isActive }) => (isActive ? 'active-link' : undefined)}>
                Balance
            </NavLink>
            <NavLink to="/purchase" className={({ isActive }) => (isActive ? 'active-link' : undefined)}>
                Purchase
            </NavLink>
            <ConnectWalletButton />
        </div>
    );
};

export default React.memo(Navbar);
