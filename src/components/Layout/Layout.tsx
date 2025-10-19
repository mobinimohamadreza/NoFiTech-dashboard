import React, {FC} from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6 bg-gray-50 min-h-screen">
                {children}
            </main>
        </div>
    );
};

export default Layout;
