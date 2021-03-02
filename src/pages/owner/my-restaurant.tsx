import { gql, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import RestaurantBanner from '../../components/common/banners/restaurant-banner';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import { Dish } from '../../components/dishes/dish';
import { DISH_FRAGMENT } from '../../graphql/fragments/dishes';
import {
  FULL_ORDER_FRAGMENT,
  ORDER_FRAGMENT,
} from '../../graphql/fragments/orders';
import { RESTAURANT_FRAGMENT } from '../../graphql/fragments/restaurants';
import { kRWFormat } from '../../services/Numbers/money';
import {
  MyRestaurant,
  MyRestaurantVariables,
} from '../../__generated__/MyRestaurant';
import { PendingOrder } from '../../__generated__/PendingOrder';

interface IParamsProps {
  id: string;
}

const PENDING_ORDER_SUBSCRIPTION = gql`
  subscription PendingOrder {
    pendingOrder {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const MY_RESTAURANT_QUERY = gql`
  query MyRestaurant($myRestaurantInput: MyRestaurantInput!) {
    myRestaurant(input: $myRestaurantInput) {
      result
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDER_FRAGMENT}
`;
const chartData = [
  { x: 1, y: 3000 },
  { x: 2, y: 1500 },
  { x: 3, y: 4250 },
  { x: 4, y: 1250 },
  { x: 5, y: 2300 },
  { x: 6, y: 7150 },
  { x: 7, y: 6830 },
  { x: 8, y: 6830 },
  { x: 9, y: 6830 },
  { x: 10, y: 6830 },
  { x: 11, y: 6830 },
];
function MyRestaurantPage() {
  const { id: restaurantId } = useParams<IParamsProps>();
  const history = useHistory();
  const { loading, error, data } = useQuery<
    MyRestaurant,
    MyRestaurantVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      myRestaurantInput: {
        restaurantId: +restaurantId,
      },
    },
  });
  const { data: subscriptionData } = useSubscription<PendingOrder>(
    PENDING_ORDER_SUBSCRIPTION,
  );
  useEffect(() => {
    if (subscriptionData?.pendingOrder) {
      history.push(`/order/${subscriptionData.pendingOrder.id}`);
    }
  }, [history, subscriptionData]);
  return (
    <>
      <ReactHelmet title="My Restaurant" />
      <div>
        {data?.myRestaurant.restaurant?.coverImage && (
          <RestaurantBanner
            coverImage={data.myRestaurant.restaurant.coverImage}
          />
        )}
        <div className="container mt-10">
          <h2 className="text-4xl font-medium mb-10">
            {data?.myRestaurant.restaurant?.name || 'Loading...'}
          </h2>
          <Link
            to={`/restaurant-detail/${restaurantId}/create-dish`}
            className="mr-8 text-white bg-gray-800 py-3 px-10">
            Add Dish &rarr;
          </Link>
          <Link to={` `} className="text-white bg-lime-700 py-3 px-10">
            Buy Promotion &rarr;
          </Link>
          <div className="mt-10">
            {data?.myRestaurant.restaurant?.menu.length === 0 ? (
              <h4 className="text-xl mb-5">Please upload a dish.</h4>
            ) : (
              <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                {data?.myRestaurant.restaurant?.menu.map((dish) => (
                  <Dish
                    id={dish.id}
                    name={dish.name}
                    description={dish.description}
                    price={dish.price}
                    key={dish.id}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mt-20 mb-10">
            <h4 className="text-center text-2xl font-medium">Sales</h4>
            <div className="mt-10">
              <VictoryChart
                width={window.innerWidth}
                height={500}
                domainPadding={50}
                containerComponent={<VictoryVoronoiContainer />}>
                <VictoryLine
                  labels={({ datum }) => kRWFormat(datum.y)}
                  labelComponent={
                    <VictoryTooltip
                      style={{ fontSize: 18 } as any}
                      renderInPortal
                      dy={-20}
                    />
                  }
                  data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                    x: order.createdAt,
                    y: order.total,
                  }))}
                  interpolation="natural"
                  style={{
                    data: {
                      strokeWidth: 5,
                    },
                  }}
                />
                <VictoryAxis
                  tickLabelComponent={<VictoryLabel renderInPortal />}
                  style={{
                    tickLabels: {
                      fontSize: 20,
                    },
                  }}
                  tickFormat={(tick) => new Date(tick).toLocaleDateString('ko')}
                />
              </VictoryChart>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyRestaurantPage;
