import React, { useState } from 'react';
import Portal from '../ui/Portal';
import { FaTimes } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { FaCcMastercard } from 'react-icons/fa';
import { SiMoneygram } from 'react-icons/si';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
  const [orderType, setOrderType] = useState('');
  const [clientName, setClientName] = useState('');
  const [nombre, setNombre] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [accountType, setAccountType] = useState('abierta');

  const resetForm = () => {
    setOrderType('');
    setClientName('');
    setNombre('');
    setPaymentMethod('');
    setAccountType('abierta');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOrderTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrderType = e.target.value;
    setOrderType(newOrderType);
    // Removed automatic client name setting to allow manual input
    setClientName('');
  };

  const handleClientNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClientName(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500"
          >
            <FaTimes size={20} />
          </button>
          
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Crear Orden</h2>
          <hr className="my-4 border-gray-300 dark:border-gray-600 mx-[-6]" />

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 px-0">
            <div className="w-full mb-0">
              <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha
              </label>
<input
                                type="datetime-local"
                                id="fecha"
                                name="fecha"
                                value={new Date().toISOString().slice(0, 16)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-2"
                            />
            </div>



            {accountType !== 'cerrada' && (
              <div className="mb-0">
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</label>
                <select
                  id="clientName"
                  name="clientName"
                  value={clientName}
                  onChange={handleClientNameChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-2"
                >
                  {orderType === 'dinein' && (
                    <>
                      <option value="Barra" className="text-xs">Barra</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={`mesa-${i + 1}`} value={`Mesa ${i + 1}`} className="text-xs">{`Mesa ${i + 1}`}</option>
                      ))}
                    </>
                  )}
                  {(orderType === 'delivery' || orderType === 'pickup') && (
                    <option value="General" className="text-xs">General</option>
                  )}
                  {clientName === '' && <option value="" disabled hidden>Seleccionar Cliente</option>}
                </select>
              </div>
            )}

            {accountType === 'cerrada' && (
              <div className="w-full mb-0">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-2"
                />
              </div>
            )}

            <div className="w-full mb-0">
              <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Orden
              </label>
              <select
                id="orderType"
                value={orderType}
                onChange={handleOrderTypeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-2"
              >
                <option value="dinein" className="text-xs">Dine In</option>
                <option value="pickup" className="text-xs">Takeaway</option>
                <option value="delivery" className="text-xs">Delivery</option>
              </select>
            </div>

            <div className="w-full mb-0">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Cuenta
              </label>
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-2"
              >
                <option value="abierta" className="text-xs">Abierta</option>
                <option value="cerrada" className="text-xs">Cerrada</option>
              </select>
            </div>

            {accountType !== 'abierta' && (
              <div className="w-full mb-0 col-span-2">
                <h2 className="text-sm mb-2 text-center">Método de Pago</h2>
                <div>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`w-full px-4 py-2 rounded-md text-sm font-medium ${paymentMethod === 'cash' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      <GiMoneyStack className="hidden sm:inline-block mr-2 text-lg" />Efectivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full px-4 py-2 rounded-md text-sm font-medium ${paymentMethod === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      <FaCcMastercard className="hidden sm:inline-block mr-2 text-lg" />Tarjeta
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={`w-full px-4 py-2 rounded-md text-sm font-medium ${paymentMethod === 'online' ? 'bg-orange-700 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      <SiMoneygram className="hidden sm:inline-block mr-2 text-lg" />En Linea
                    </button>
                  </div>
                </div>
              </div>
            )}




          </div>
          <hr className="my-4 border-gray-300 dark:border-gray-600 mx-[-6]" />

          {/* Content for creating a new order will go here */}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              className="text-green-700 hover:text-green-500 font-bold py-2 px-4 rounded"
            >
              Guardar Orden
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default CreateOrderModal;