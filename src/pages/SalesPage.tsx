import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CreateOrderModal from '../components/pos/CreateOrderModal';

const SalesPage = () => {
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);

  const handleOpenCreateOrderModal = () => {
    setIsCreateOrderModalOpen(true);
  };

  const handleCloseCreateOrderModal = () => {
    setIsCreateOrderModalOpen(false);
  };

  return (
    <div className="space-y-6 md:ml-32 pt-4 md:pt-0 md:-mt-10">
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Productos</h2>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-0.5 px-1.5 rounded"
          onClick={handleOpenCreateOrderModal}
        >
          Crear Orden
        </button>
      </div>
      <div className="card mt-2">
        {/* Aquí irá el contenido para seleccionar productos */}
      </div>

      <CreateOrderModal
        isOpen={isCreateOrderModalOpen}
        onClose={handleCloseCreateOrderModal}
      />
    </div>
  );
};

export default SalesPage;