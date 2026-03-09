import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'auto' | 'default' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    as?: React.ElementType;
}

export const CustomButton: React.FC<NeoButtonProps> = ({
    children,
    variant = 'auto',
    size = 'md',
    className = '',
    as: Component = 'button',
    ...props
}) => {
    const base =
        'inline-flex items-center justify-center border-4 font-bold uppercase tracking-wide transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer';

    const variants = {
        auto: 'bg-(--background) text-(--foreground) border-(--neo-border-color) neo-shadow',
        default: 'bg-white text-black border-black shadow-[4px_4px_0px_0px_var(--color-black)]',
        dark: 'bg-black text-white border-white shadow-[4px_4px_0px_0px_var(--color-white)]',
    };

    const sizes = {
        sm: 'p-2 text-xs gap-1',
        md: 'p-3 text-sm gap-2',
        lg: 'px-6 py-4 text-base gap-2',
    };

    return (
        <Component
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...(Component === 'button' ? props : {})}
        >
            {children}
        </Component>
    );
};

export default CustomButton;