import React from 'react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useState } from 'react';
import { format } from 'date-fns';
import AddIngredientsModal from '../components/kitchen/AddIngredientsModal';
import { es } from 'date-fns/locale';

const InventoryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 md:ml-32 pt-4 md:pt-0 md:-mt-10">
      <AddIngredientsModal isOpen={isModalOpen} onClose={handleCloseModal} />
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
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Inventario Actual</h3>
      </div>
      <div className="mb-4 flex justify-end items-center space-x-2">
        <input type="date" className="p-0 border border-gray-300 rounded-md bg-white text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center" defaultValue={new Date().toISOString().split('T')[0]} />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-1 rounded text-xs md:py-1 md:px-2 md:text-sm"
          onClick={handleOpenModal}
        >
          Agregar Ingrediente
        </button>
      </div>
      <div className="card">

        <div className="mt-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">IDP</th>
                <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Costo Pedido</th>
                <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Costo Unitario</th>
                <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio</th>
                <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Inicial</th>
                <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Actual</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {/* Table rows will go here */}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;