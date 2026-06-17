import React from 'react';
import Navbar from './Navbar';
import WhatsAppButton from './WhatsAppButton';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                {children}
            </main>
            <WhatsAppButton />
        </div>
    );
};

export default Layout;