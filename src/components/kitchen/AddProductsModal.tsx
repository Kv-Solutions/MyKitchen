import React, { useState } from 'react';
import { FaTimes, FaDollarSign } from 'react-icons/fa';
import { IoFastFoodSharp } from 'react-icons/io5';
import { MdAccessTime, MdStickyNote2 } from 'react-icons/md';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { PiBowlFoodFill } from 'react-icons/pi';

interface AddProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductsModal: React.FC<AddProductsModalProps> = ({ isOpen, onClose }) => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [preparationTime, setPreparationTime] = useState(''); // Added state for preparation time
  const [productPrice, setProductPrice] = useState(''); // Added state for product price
  const [notes, setNotes] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  if (!isOpen) return null;

  const updateButtonVisibility = (name: string, category: string, time: string, price: string, notes: string, ingredients: string) => {
    setIsButtonVisible(name.trim() !== '' || category.trim() !== '' || time.trim() !== '' || price.trim() !== '' || notes.trim() !== '' || ingredients.trim() !== '');
  };

  const handleProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setProductName(value);
    updateButtonVisibility(value, productCategory, preparationTime, productPrice, notes, ingredients);
  };

  const handleProductCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setProductCategory(value);
    updateButtonVisibility(productName, value, preparationTime, productPrice, notes, ingredients);
  };

  const handlePreparationTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPreparationTime(value);
    updateButtonVisibility(productName, productCategory, value, productPrice, notes, ingredients);
  };

  const handleProductPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setProductPrice(value);
    updateButtonVisibility(productName, productCategory, preparationTime, value, notes, ingredients);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setNotes(value);
    updateButtonVisibility(productName, productCategory, preparationTime, productPrice, value, ingredients);
  };

  const handleIngredientsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setIngredients(value);
    updateButtonVisibility(productName, productCategory, preparationTime, productPrice, notes, value);
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
        
        <h2 className="text-xl font-bold mb-4 dark:text-white">Agregar Producto</h2>
        <hr className="mb-4 border-gray-300 dark:border-gray-600" />
        
        <div className="grid grid-cols-1 gap-00"> {/* Added wrapper div with grid classes */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3"> {/* Added wrapper div with grid classes */}
            <div className="mb-4">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre de Producto
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <IoFastFoodSharp className="h-4 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={productName}
                  onChange={handleProductNameChange}
                  className="mt-1 block w-full pl-7 pr-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ej. Pizza, Hamburguesa, Refresco"
                />
              </div>
            </div>

            {/* New Category Field */}
            <div className="mb-4">
              <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoría
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <BiSolidFoodMenu className="h-4 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  id="productCategory"
                  name="productCategory"
                  value={productCategory}
                  onChange={handleProductCategoryChange}
                  className="mt-1 block w-full pl-7 pr-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ej. Comida Rápida, Bebidas, Postres"
                />
              </div>
            </div>

            {/* New Preparation Time Field */}
            <div className="mb-4">
              <label htmlFor="preparationTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tiempo Preparación
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <MdAccessTime className="h-4 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="number"
                  id="preparationTime"
                  name="preparationTime"
                  value={preparationTime}
                  onChange={handlePreparationTimeChange}
                  className="mt-1 block w-full pl-7 pr-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ej. 30, 45, 60"
                />
              </div>
            </div>

            {/* New Price Field */}
            <div className="mb-4">
              <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Precio
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <FaDollarSign className="h-4 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="number"
                  id="productPrice"
                  name="productPrice"
                  value={productPrice}
                  onChange={handleProductPriceChange}
                  className="mt-1 block w-full pl-6 pr-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* New Notes Field */}
          <div className="mb-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notas
            </label>
            <div className="relative mt-1">
              <div className="absolute top-2 left-0 pl-1 flex items-center pointer-events-none">
                <MdStickyNote2 className="h-4 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <textarea
                id="notes"
                name="notes"
                value={notes}
                onChange={handleNotesChange}
                className="mt-1 block w-full pl-7 pr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Notas adicionales sobre el producto"
                rows={2}
              ></textarea>
            </div>
          </div>

          {/* New Ingredients Field */}
          <div className="mb-4">
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ingredientes
            </label>
            <div className="relative mt-1">
              <div className="absolute top-2 left-0 pl-1 flex items-center pointer-events-none">
                <PiBowlFoodFill className="h-4 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <textarea
                id="ingredients"
                name="ingredients"
                value={ingredients}
                onChange={handleIngredientsChange}
                className="mt-1 block w-full pl-7 pr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Lista de ingredientes"
                rows={2}
              ></textarea>
            </div>
          </div>
        </div>

        {isButtonVisible && (
          <hr className="mb-4 border-gray-300 dark:border-gray-600" />
        )}
        
        {isButtonVisible && (
          <div className="flex justify-end space-x-3">
            <a
              href="#"
              className="text-green-600 hover:text-green-500 no-underline"
            >
              Agregar
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductsModal;