import React from 'react';
import styles from '@/shared/ui/Button/Button.module.scss';

interface ButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, type = 'button', disabled = false, className = '' }) => {
    return (
        <button onClick={onClick} type={type} disabled={disabled} className={`${styles.button} ${className}`}>
            {children}
        </button>
    );
};

export default Button;
