import React from 'react';
import { RestaurantQuery_restaurant_restaurant_menu_options } from '../../__generated__/RestaurantQuery';

interface IDishProps {
  id: string;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  options?: RestaurantQuery_restaurant_restaurant_menu_options[] | null;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: string) => void;
  removeFromOrder?: (dishId: string) => void;
  isSelected?: boolean;
}

export const Dish: React.FC<IDishProps> = ({
  id,
  description,
  name,
  price,
  isCustomer = false,
  options = null,
  orderStarted = false,
  addItemToOrder,
  removeFromOrder,
  isSelected = false,
  children: dishOptions,
}) => {
  const handleDishClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };
  return (
    <div
      className={`px-8 py-4 border cursor-pointer transition-all ${
        isSelected ? 'border-gray-800' : 'hover:border-gray-800'
      }`}>
      <div className="mb-5">
        <div className="flex">
          <h3 className="text-lg font-medium ">{name}</h3>
          <button
            onClick={handleDishClick}
            className={`${
              isSelected ? 'bg-red-500' : 'bg-green-500'
            } ml-5 text-white px-2`}>
            {isSelected ? 'Remove' : 'Add'}
          </button>
        </div>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options.length > 0 && dishOptions}
    </div>
  );
};
