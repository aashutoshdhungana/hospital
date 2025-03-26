import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider } from '../../ui/sidebar';

interface LayoutProps {
  children: ReactNode;
}

const ReceptionistLayout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ReceptionistLayout;
