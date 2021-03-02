import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FULL_ORDER_FRAGMENT } from '../graphql/fragments/orders';
import { useMe } from '../hooks/useMe';
import { OrderStatus, UserRole } from '../__generated__/globalTypes';
import { Order, OrderVariables } from '../__generated__/Order';
import { UpdatedOrder } from '../__generated__/UpdatedOrder';
import {
  UpdateOrder,
  UpdateOrderVariables,
} from '../__generated__/UpdateOrder';

interface IParamsProps {
  id: string;
}

const GET_ORDER = gql`
  query Order($orderId: Int!) {
    order(orderId: $orderId) {
      result
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const UPDATE_ORDER = gql`
  mutation UpdateOrder($updateOrderInput: UpdateOrderInput!) {
    updateOrder(input: $updateOrderInput) {
      result
      error
    }
  }
`;

const ORDER_SUBSCRIPTION = gql`
  subscription UpdatedOrder($orderId: Int!) {
    updatedOrder(orderId: $orderId) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

function OrderPage() {
  const { id } = useParams<IParamsProps>();
  const { loading: meLoading, data: meData } = useMe();
  const { data, subscribeToMore } = useQuery<Order, OrderVariables>(GET_ORDER, {
    variables: {
      orderId: +id,
    },
  });
  const [updateOrderMutation] = useMutation<UpdateOrder, UpdateOrderVariables>(
    UPDATE_ORDER,
  );
  const onButtonClick = (newStatus: OrderStatus) => {
    updateOrderMutation({
      variables: {
        updateOrderInput: {
          id,
          status: newStatus,
        },
      },
    });
  };
  useEffect(() => {
    if (data?.order.result) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          orderId: +id,
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: UpdatedOrder } },
        ) => {
          if (!data) {
            return prev;
          }
          return {
            order: {
              ...prev.order,
              order: {
                ...data.updatedOrder,
              },
            },
          };
        },
      });
    }
  }, [data, id, subscribeToMore]);

  if (meLoading) {
    <div>Loading...</div>;
  }
  return (
    <div className="mt-32 container flex justify-center">
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.order.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:
            <span className="font-medium">
              {data?.order.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Deliver To:
            <span className="font-medium">
              {data?.order.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:
            <span className="font-medium">
              {data?.order.order?.driver?.email || 'Not yet.'}
            </span>
          </div>
          {meData?.me.role === UserRole.Client && (
            <>
              <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                Status: {data?.order.order?.status}
              </span>
              {data?.order.order?.status === OrderStatus.Delivered && (
                <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
                  Thank you for your service!
                </span>
              )}
            </>
          )}
          {meData?.me.role === UserRole.Owner && (
            <>
              {data?.order.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                  className="btn">
                  Accept Order
                </button>
              )}
              {data?.order.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                  className="btn">
                  Order Cooked
                </button>
              )}
              <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                Status: {data?.order.order?.status}
              </span>
              {data?.order.order?.status === OrderStatus.Delivered && (
                <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
                  Thank you for your service!
                </span>
              )}
            </>
          )}
          {meData?.me.role === UserRole.Delivery && (
            <>
              {data?.order.order?.status === OrderStatus.Cooked && (
                <button
                  onClick={() => onButtonClick(OrderStatus.PickedUp)}
                  className="btn">
                  Picked Up
                </button>
              )}
              {data?.order.order?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Delivered)}
                  className="btn">
                  Order Delivered
                </button>
              )}
              <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                Status: {data?.order.order?.status}
              </span>
              {data?.order.order?.status === OrderStatus.Delivered && (
                <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
                  Thank you for your service!
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
