import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebarStore } from '../../stores/sidebarStore';

export const MainLayout: React.FC = () => {
  const { collapsed } = useSidebarStore();
  
  return (
    <div className="h-screen flex flex-col">
      <Sidebar />
      <Header />
      
      <main className={`
        pt-16 pb-8 px-6 transition-all overflow-y-auto
        ${collapsed ? 'ml-16' : 'md:ml-16 ml-0'}
      `}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};