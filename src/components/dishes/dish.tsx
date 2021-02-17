import React from 'react';
import { kRWFormat } from '../../services/Numbers/money';
import { RestaurantQuery_restaurant_restaurant_menu_options } from '../../__generated__/RestaurantQuery';

interface IDishProps {
  id?: string;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  options?: RestaurantQuery_restaurant_restaurant_menu_options[] | null;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: string) => void;
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
}) => {
  return (
    <div
      onClick={() =>
        orderStarted && addItemToOrder && id ? addItemToOrder(id) : null
      }
      className="px-8 py-4 border cursor-pointer hover:border-gray-800 transition-all ">
      <div className="mb-5">
        <h3 className="text-lg font-medium ">{name}</h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer &&
        options &&
        options.length > 0 &&
        options.map(({ name, extra }, index) => (
          <div className="flex items-center justify-between" key={index}>
            <span>{name}</span>
            <span>{extra ? kRWFormat(extra) : 'free'}</span>
          </div>
        ))}
    </div>
  );
};
