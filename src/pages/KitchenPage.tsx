import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { OrderCard } from '../components/kitchen/OrderCard';
import { KitchenStats } from '../components/kitchen/KitchenStats';
import { CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import toast from 'react-hot-toast';

// Mock data - In a real app, this would come from Supabase
const MOCK_ORDERS = [
  {
    id: '1234abcd',
    customerName: 'Juan Pérez',
    tableNumber: 5,
    items: [
      { id: 'item1', name: 'Hamburguesa Especial', quantity: 2, preparationTime: 15, startedAt: new Date(Date.now() - 3 * 60 * 1000) },
      { id: 'item2', name: 'Papas Fritas', quantity: 1, preparationTime: 8, startedAt: new Date(Date.now() - 3 * 60 * 1000) }
    ],
    createdAt: new Date(Date.now() - 3 * 60 * 1000)
  },
  {
    id: '5678efgh',
    tableNumber: 3,
    items: [
      { id: 'item3', name: 'Pasta Alfredo', quantity: 1, preparationTime: 20, startedAt: new Date(Date.now() - 12 * 60 * 1000) },
      { id: 'item4', name: 'Ensalada César', quantity: 1, preparationTime: 5, startedAt: new Date(Date.now() - 12 * 60 * 1000) }
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 1000)
  },
  {
    id: '9012ijkl',
    customerName: 'María Rodríguez',
    items: [
      { id: 'item5', name: 'Pizza Margarita', quantity: 1, preparationTime: 25, startedAt: new Date() }
    ],
    createdAt: new Date()
  }
];

export const KitchenPage: React.FC = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [completedCount, setCompletedCount] = useState(12); // Mock data
  
  const handleOrderComplete = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
    setCompletedCount(prevCount => prevCount + 1);
    
    // Play sound for order completion
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play();
    
    toast.success('Orden marcada como servida');
  };
  
  // Simulating new orders arriving
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddOrder = Math.random() > 0.7; // 30% chance of new order
      
      if (shouldAddOrder && orders.length < 8) {
        const newOrder = {
          id: Math.random().toString(36).substring(2, 10),
          tableNumber: Math.floor(Math.random() * 10) + 1,
          items: [
            { 
              id: `item-${Math.random().toString(36).substring(2, 10)}`, 
              name: ['Pollo a la Parrilla', 'Hamburguesa Especial', 'Pasta Alfredo', 'Ensalada César', 'Tacos de Carnitas'][Math.floor(Math.random() * 5)], 
              quantity: Math.floor(Math.random() * 3) + 1, 
              preparationTime: Math.floor(Math.random() * 20) + 5,
              startedAt: new Date()
            }
          ],
          createdAt: new Date()
        };
        
        setOrders(prev => [...prev, newOrder]);
        
        // Play sound for new order
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2877/2877-preview.mp3');
        audio.play();
        
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <CheckCircle2 className="h-10 w-10 text-primary-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nueva orden recibida
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Mesa {newOrder.tableNumber} - {newOrder.items[0].name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        ));
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [orders]);
  
  const kitchenStats = {
    averagePreparationTime: '18 minutos',
    completedOrders: completedCount,
    onTimeOrders: 25,
    delayedOrders: 3,
    estimatedWaitTime: orders.length > 0 ? `${orders.length * 5} minutos` : 'Sin espera',
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
      
      <KitchenStats {...kitchenStats} />
      
      <h2 className="text-xl font-semibold mt-6">Órdenes en Preparación</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle2 className="h-16 w-16 mx-auto text-success-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">¡Todas las órdenes completadas!</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            No hay órdenes pendientes en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard 
              key={order.id}
              id={order.id}
              customerName={order.customerName}
              tableNumber={order.tableNumber}
              items={order.items}
              createdAt={order.createdAt}
              onComplete={handleOrderComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};