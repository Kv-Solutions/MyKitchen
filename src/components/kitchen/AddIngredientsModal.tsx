import React from 'react';
import Portal from '../ui/Portal';
import { FaTimes } from 'react-icons/fa';

interface AddIngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useState, useEffect } from 'react';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { useBusinessSettings } from '../../hooks/useBusinessSettings';

const AddIngredientsModal: React.FC<AddIngredientsModalProps> = ({ isOpen, onClose }) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [idp, setIdp] = useState('');
  const [dailyCounter, setDailyCounter] = useState(0);
  const { settings } = useBusinessSettings();

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = (today.getMonth() + 1).toString().padStart(2, '0');

      const lastIdpDate = localStorage.getItem('lastIdpDate');
      const lastIdpCounter = parseInt(localStorage.getItem('lastIdpCounter') || '0');

      let currentCounter = lastIdpCounter;

      if (lastIdpDate) {
        const [lastYear, lastMonth, lastDay] = lastIdpDate.split('-');
        if (parseInt(lastYear) !== today.getFullYear() || parseInt(lastMonth) !== (today.getMonth() + 1)) {
          // New month, reset counter
          currentCounter = 1;
        } else {
          // Same month, increment counter
          currentCounter++;
        }
      } else {
        // First time, start counter at 1
        currentCounter = 1;
      }

      const formattedCounter = currentCounter.toString().padStart(2, '0');
      setIdp(`${year}${month}${formattedCounter}`);
      setDailyCounter(currentCounter);

      localStorage.setItem('lastIdpDate', `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`);
      localStorage.setItem('lastIdpCounter', currentCounter.toString());
    }
  }, [isOpen]);
  const [nombre, setNombre] = useState('');
  const [costo, setCosto] = useState('');
  const [cu, setCu] = useState('');
  const [precio, setPrecio] = useState('');
  const [stockInicial, setStockInicial] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [showButtonAndDivider, setShowButtonAndDivider] = useState(false);

  const checkFieldsForData = () => {
    if (nombre || costo || cu || precio || stockInicial || stockActual) {
      setShowButtonAndDivider(true);
    } else {
      setShowButtonAndDivider(false);
    }
  };

  useEffect(() => {
    checkFieldsForData();
  }, [nombre, costo, cu, precio, stockInicial, stockActual]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500"
          >
            <FaTimes size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4 dark:text-white">Agregar Ingrediente</h2>
          <hr className="mb-4 border-gray-300 dark:border-gray-600" />
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
              <input type="date" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-2" />
            </div>
            <div>
              <label htmlFor="idp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">IDP</label>
              <input type="text" id="idp" value={idp} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 pl-2" />
            </div>
            <div className="relative">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <div className="relative mt-1">
                <input type="text" id="nombre" value={nombre} onChange={(e) => {setNombre(e.target.value); checkFieldsForData();}} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-7 pr-3 py-0" />
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <MdOutlineDriveFileRenameOutline className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="costo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Costo Pedido</label>
              <div className="relative">
                <input type="number" id="costo" value={costo} onChange={(e) => {setCosto(e.target.value); checkFieldsForData();}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-10 pr-3 py-0" placeholder="0.00" />
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <span className="text-gray-400 dark:text-white text-sm">{settings?.currency}</span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="cu" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Costo Unitario</label>
              <div className="relative">
                <input type="text" id="cu" value={cu} onChange={(e) => {setCu(e.target.value); checkFieldsForData();}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-10 pr-3 py-0" placeholder="0.00" />
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <span className="text-gray-400 dark:text-white text-sm">{settings?.currency}</span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
              <div className="relative">
                <input type="number" id="precio" value={precio} onChange={(e) => {setPrecio(e.target.value); checkFieldsForData();}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-10 pr-3 py-0" placeholder="0.00" />
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <span className="text-gray-400 dark:text-white text-sm">{settings?.currency}</span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="stockInicial" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Inicial</label>
              <input type="number" id="stockInicial" value={stockInicial} onChange={(e) => {setStockInicial(e.target.value); checkFieldsForData();}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-2" placeholder="0.00" />
            </div>
            <div>
              <label htmlFor="stockActual" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Actual</label>
              <input type="number" id="stockActual" value={stockActual} onChange={(e) => {setStockActual(e.target.value); checkFieldsForData();}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-2" placeholder="0.00" />
            </div>
          </div>
          {showButtonAndDivider && (
            <>
              <hr className="my-4 border-gray-300 dark:border-gray-600" />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400"
                >
                  Agregar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default AddIngredientsModal;