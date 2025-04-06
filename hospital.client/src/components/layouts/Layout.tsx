import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider } from '../ui/sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
