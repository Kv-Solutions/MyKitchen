import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { useState } from 'react';

interface AddCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoriesModal: React.FC<AddCategoriesModalProps> = ({ isOpen, onClose }) => {
  const [categoryName, setCategoryName] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(event.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500"
        >
          <FaTimes size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4 dark:text-white">Agregar Categoría</h2>
        <hr className="mb-4 border-gray-300 dark:border-gray-600" />
        
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre de la Categoría
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <BiSolidFoodMenu className="h-4 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              className="mt-1 block w-full pl-8 pr-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ej. Bebidas, Platos Fuertes"
              value={categoryName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        {categoryName && (
          <hr className="mb-4 border-gray-300 dark:border-gray-600" />
        )}

        <div className="flex justify-end space-x-3">
          {/* <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button> */}
          {categoryName && (
            <button
              className="text-green-600 hover:text-green-500 font-bold py-2 px-4 rounded bg-transparent border-none underline-offset-0"
            >
              Guardar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategoriesModal;