import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users } from 'lucide-react';
import { FaCircleDollarToSlot } from 'react-icons/fa6';
import { IoTicket } from 'react-icons/io5';
import { PiBowlFoodBold } from 'react-icons/pi';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { StatCard } from '../components/dashboard/StatCard';
import { SalesChart } from '../components/dashboard/SalesChart';

export const DashboardPage: React.FC = () => {
  // Sample data - In real app, would come from API/Supabase
  const salesData = {
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    datasets: [
      {
        label: 'Esta semana',
        data: [4500, 5200, 4800, 6200, 7800, 8500, 7200],
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Semana pasada',
        data: [3800, 4800, 4200, 5800, 7200, 7500, 6800],
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6 md:ml-32 pt-4 md:pt-0 md:-mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">
          {(() => {
            const formattedDate = format(new Date(), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es });
            const parts = formattedDate.split(',');
            if (parts.length > 0) {
              const day = parts[0];
              const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
              return [capitalizedDay, ...parts.slice(1)].join(',');
            }
            return formattedDate; // Fallback if split fails
          })()}
        </h1>
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Ventas"
          value="18,500"
          prefix="L. "
          icon={<FaCircleDollarToSlot className="h-3 w-3 sm:h-6 sm:w-6 text-green-500" />}
          change={12}
          trend="up"
          borderColor="border-green-500"
        />
        
        <StatCard 
          title="Gastos"
          value="1200"
          prefix="L. "
          icon={<FaCircleDollarToSlot className="h-3 w-3 sm:h-6 sm:w-6 text-red-500" />}
          change={-5}
          trend="down"
        />
        
        <StatCard 
          title="Clientes"
          value="28"
          icon={<Users className="h-3 w-3 sm:h-6 sm:w-6" />}
          change={-3}
          trend="down"
        />
        
        <StatCard 
          title="Ticket Promedio"
          value="578"
          prefix="L. "
          icon={<IoTicket className="h-3 w-3 sm:h-6 sm:w-6 text-purple-500" />}
          change={5}
          trend="up"
          borderColor="border-purple-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart data={salesData} />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
            <span>Platos Más Vendidos</span>
            <PiBowlFoodBold className="h-5 w-5 text-orange-500" />
          </h3>
          <ul className="space-y-2">
            {[
              { name: 'Pollo a la Parrilla', count: 24, amount: 4800 },
              { name: 'Hamburguesa Especial', count: 18, amount: 3600 },
              { name: 'Pasta Alfredo', count: 16, amount: 3200 },
              { name: 'Ensalada César', count: 12, amount: 1800 },
              { name: 'Tacos de Carnitas', count: 10, amount: 1500 },
            ].map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.count} unidades</p>
                </div>
                <p className="font-semibold">L. {item.amount.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </div>
  );
};