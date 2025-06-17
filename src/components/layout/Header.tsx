import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { useSidebarStore } from '../../stores/sidebarStore';
import { Link } from 'react-router-dom';
import { MdDashboardCustomize } from 'react-icons/md';
import { TbCashRegister } from 'react-icons/tb';
import { IoWallet } from 'react-icons/io5';
import { ChefHat } from 'lucide-react';
import { BsFillMenuButtonWideFill } from 'react-icons/bs';
import { useState, useRef, useEffect } from 'react';
import { LogOut, Settings } from 'lucide-react';
import { FaBoxesPacking, FaChartColumn } from 'react-icons/fa6';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { collapsed } = useSidebarStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className={`
      fixed top-0 right-0 z-10 h-16 flex items-center justify-between px-4 border-b bg-white
      border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all md:hidden
      ${collapsed ? 'left-16' : 'md:left-48 left-0'}
    `}>
      <div className="flex items-center gap-4">
        {user?.business?.logo_url ? (
          <img 
            src={user.business.logo_url} 
            alt="Logo del negocio" 
            className="h-8 w-8 object-cover rounded-md"
          />
        ) : (
          <ChefHat className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        )}

      <div className="flex items-center gap-4 mr-0"></div>
        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <MdDashboardCustomize className="h-6 w-6" />
        </Link>
        <Link to="/pos" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <TbCashRegister className="h-6 w-6" />
        </Link>
        <Link to="/accounts" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <IoWallet className="h-6 w-6" />
        </Link>
        <Link to="/kitchen" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <ChefHat className="h-6 w-6" />
        </Link>
        <Link to="/menu" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <BsFillMenuButtonWideFill className="h-6 w-6" />
        </Link>


      </div>

      
      <div className="flex items-center gap-0">
        <ThemeToggle />
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Avatar 
              src={user?.avatar_url} 
              alt={user?.full_name || 'User'} 
              fallback={user?.full_name || 'User'} 
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-6 w-39 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-20">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-900 dark:text-white">{user?.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role === 'master' ? 'Master User' :
                   user?.role === 'admin' ? 'Administrador' :
                   user?.role === 'cashier' ? 'Cajero' : 'Cocinero'}
                </p>
              </div>

              <Link to="/inventory" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                <FaBoxesPacking className="h-4 w-4" />
                Inventario
              </Link>
              <Link to="/reports" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                <FaChartColumn className="h-4 w-4" />
                Reportes
              </Link>
              <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                <Settings className="h-4 w-4" />
                Opciones
              </Link>
              <hr className="border-gray-200 dark:border-gray-700 my-1" />
              <button 
                onClick={signOut}
                className="flex items-center gap-1 w-full px-2 py-2 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};