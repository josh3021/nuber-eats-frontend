import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import { Dish } from '../../components/dishes/dish';
import { DISH_FRAGMENT } from '../../graphql/fragments/dishes';
import { RESTAURANT_FRAGMENT } from '../../graphql/fragments/restaurants';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import {
  RestaurantQuery,
  RestaurantQueryVariables,
} from '../../__generated__/RestaurantQuery';

interface IRestaurantDetailParams {
  id: string;
}

const RESTAURANT_QUERY = gql`
  query RestaurantQuery($restaurantInput: RestaurantInput!) {
    restaurant(input: $restaurantInput) {
      result
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(input: $createOrderInput) {
      result
      error
    }
  }
`;

function RestaurantDetail() {
  const params = useParams<IRestaurantDetailParams>();
  const { loading, error, data: restaurantData } = useQuery<
    RestaurantQuery,
    RestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      restaurantInput: {
        restaurantId: +params['id'],
      },
    },
  });
  const [orderStarted, setOrderStarted] = useState<boolean>(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const onTriggerStartOrder = () => {
    setOrderStarted(true);
  };
  const addItemToOrder = (dishId: string) => {
    setOrderItems((current) => [{ dishId }]);
  };
  return (
    <>
      <ReactHelmet title="Restaurant Detail" />
      <div
        className="bg-gray-800 bg-center bg-cover py-48"
        style={{
          backgroundImage: `url(${restaurantData?.restaurant.restaurant?.coverImage})`,
        }}>
        <div className="bg-white w-3/12 py-8 pl-48">
          <h4 className="text-4xl mb-3">
            {restaurantData?.restaurant.restaurant?.name}
          </h4>
          <h5 className="text-sm font-light mb-2">
            {restaurantData?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {restaurantData?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="container flex flex-col items-end mt-20 mb-40">
        <button
          className="text-lg font-medium focus:outline-none text-white py-4 transition-colors bg-lime-500 hover:bg-lime-600 px-8"
          onClick={onTriggerStartOrder}>
          Start Order
        </button>
        <button className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {restaurantData?.restaurant.restaurant?.menu.map((dish) => (
            <Dish
              id={dish.id}
              addItemToOrder={addItemToOrder}
              orderStarted={orderStarted}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              key={dish.id}
              isCustomer
              options={dish.options}
            />
          ))}
        </button>
      </div>
    </>
  );
}

export default RestaurantDetail;
