import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import { Dish } from '../../components/dishes/dish';
import { DishOption } from '../../components/dishes/dish-option';
import { DISH_FRAGMENT } from '../../graphql/fragments/dishes';
import { RESTAURANT_FRAGMENT } from '../../graphql/fragments/restaurants';
import {
  CreateOrder,
  CreateOrderVariables,
} from '../../__generated__/CreateOrder';
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
      orderId
    }
  }
`;

function RestaurantDetail() {
  const params = useParams<IRestaurantDetailParams>();
  const history = useHistory();
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
  const onCompleted = (data: CreateOrder) => {
    const {
      createOrder: { result, orderId },
    } = data;
    if (result) {
      history.push(`/order/${orderId}`);
    }
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    CreateOrder,
    CreateOrderVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });

  const [orderStarted, setOrderStarted] = useState<boolean>(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const getItem = useCallback(
    (dishId: string) => {
      return orderItems.find((order) => order.dishId === dishId);
    },
    [orderItems],
  );

  const onTriggerStartOrder = () => {
    setOrderStarted(true);
  };
  const onTriggerConfirmOrder = () => {
    if (placingOrder) {
      return;
    }
    if (orderItems.length === 0) {
      window.alert("Can't order empty order");
    } else {
      const ok = window.confirm('You are about to place an order');
      if (ok && !placingOrder) {
        createOrderMutation({
          variables: {
            createOrderInput: {
              restaurantId: params.id,
              items: orderItems,
            },
          },
        });
      }
    }
  };
  const onTriggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  const isSelected = (dishId: string) => {
    return Boolean(getItem(dishId));
  };
  const addItemToOrder = (dishId: string) => {
    if (isSelected(dishId)) {
      return;
    }
    if (orderItems.find((order) => order.dishId === dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };
  const removeFromOrder = (dishId: string) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId),
    );
  };
  const addOptionToItem = (dishId: string, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((oldOption) => oldOption.name === optionName),
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          {
            dishId,
            options: [
              { name: optionName },
              ...(oldItem.options ? oldItem.options : []),
            ],
          },
          ...current,
        ]);
      }
    }
  };
  const removeOptionFromItem = (dishId: string, optionName: string) => {
    if (!isSelected(dishId)) return;
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName,
          ),
        },
        ...current,
      ]);
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string,
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: string, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };
  useEffect(() => {
    const totalMenus = restaurantData?.restaurant.restaurant?.menu;
    if (totalMenus) {
      let accumulator: number = 0;
      orderItems.forEach((orderItem) => {
        const menu = totalMenus.find((menu) => menu.id === orderItem.dishId);
        if (menu) {
          accumulator += menu.price;
          const selectedOptions = getItem(menu.id);
          if (menu.options && selectedOptions && selectedOptions.options) {
            const filteredMenus = menu.options.filter((originalOption) => {
              if (!selectedOptions.options) return false;
              return selectedOptions.options.find(
                (option) => option.name === originalOption.name,
              );
            });
            filteredMenus.forEach((filteredMenu) => {
              if (filteredMenu.extra) {
                accumulator += filteredMenu.extra;
              }
            });
          }
        }
      });
      setTotalPrice(accumulator);
    }
  }, [getItem, orderItems, restaurantData?.restaurant.restaurant?.menu]);
  console.log(orderItems);
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
        {orderStarted ? (
          <div className="flex items-center">
            {totalPrice}
            <button
              className="text-lg font-medium focus:outline-none text-white py-4 transition-colors bg-lime-500 hover:bg-lime-600 px-8 mr-3"
              onClick={onTriggerConfirmOrder}>
              Confirm Order
            </button>
            <button
              className="text-lg font-medium focus:outline-none text-white py-4 transition-colors bg-gray-700 hover:bg-gray-900 px-8"
              onClick={onTriggerCancelOrder}>
              Cancel Order
            </button>
          </div>
        ) : (
          <button
            className="text-lg font-medium focus:outline-none text-white py-4 transition-colors bg-lime-500 hover:bg-lime-600 px-8"
            onClick={onTriggerStartOrder}>
            Start Order
          </button>
        )}
        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {restaurantData?.restaurant.restaurant?.menu.map((dish) => (
            <Dish
              id={dish.id}
              isSelected={isSelected(dish.id)}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
              orderStarted={orderStarted}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              key={dish.id}
              isCustomer
              options={dish.options}>
              {dish.options?.map(({ name, extra }, index) => (
                <DishOption
                  isSelected={isOptionSelected(dish.id, name)}
                  name={name}
                  extra={extra}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                  dishId={dish.id}
                  key={index}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </>
  );
}

export default RestaurantDetail;
